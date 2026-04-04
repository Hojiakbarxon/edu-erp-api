import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { ISuccess } from 'src/utils/success.response';
import { Conflicts } from 'src/utils/check-existance';
import { UserRoles } from 'src/enums';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LessonsService {
  constructor(@InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>, @InjectRepository(Group) private readonly groupRepo: Repository<Group>) { }

  async create(createLessonDto: CreateLessonDto, currentUser: { id: number, role: UserRoles }): Promise<ISuccess> {

    let { title, group_id } = createLessonDto
    let group = await this.groupRepo.findOne({
      where: { id: group_id },
      relations: {
        users: true
      }
    }) as Group
    if (!group) {
      throw new NotFoundException(`Group is not found`)
    }
    let users = group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }
    let existedLesson = await this.lessonRepo.findOne({
      where: { title, group: { id: group_id } }
    })
    if (existedLesson) {
      throw new ConflictException(`This lesson on this group already exists`)
    }

    let newLesson = this.lessonRepo.create({
      ...createLessonDto,
      group
    })

    await this.lessonRepo.save(newLesson)

    let lesson = await this.lessonRepo.findOne({
      where: { id: newLesson.id },
      relations: {
        group: true,
      },
      select: {
        id: true,
        title: true,
        start_time: true,
        end_time: true,
        group: {
          id: true,
          name: true
        }
      }
    }) as Lesson

    return {
      statusCode: 201,
      message: "created",
      data: lesson
    }
  }

  async findAll(): Promise<ISuccess> {
    let lessons = await this.lessonRepo.find({
      relations: { group: true },
      select: {
        id: true,
        title: true,
        start_time: true,
        end_time: true,
        group: {
          id: true,
          name: true
        }
      }
    })
    return {
      statusCode: 200,
      message: "success",
      data: lessons
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.lessonRepo, 'lesson')
    let lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        group: true,
        videos: true,
        homeworks: true
      },
      select: {
        id: true,
        title: true,
        start_time: true,
        end_time: true,
        homeworks: true,
        videos: true,
        group: {
          id: true,
          name: true
        }
      }
    }) as Lesson

    return {
      statusCode: 200,
      message: "success",
      data: lesson
    }
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, currentUser: { id: number, role: UserRoles }): Promise<ISuccess> {
    let lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: { group: { users: true } }
    })
    if (!lesson) {
      throw new NotFoundException(`The lesson is  not found`)
    }
    let users = lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }
    if (updateLessonDto.title) {
      let existedLesson = await this.lessonRepo.findOne({
        where: {
          title: updateLessonDto.title,
          group: { id: lesson?.group.id }
        }
      })
      if (existedLesson && existedLesson.id !== id) {
        throw new ConflictException(`This lesson already exists in this group`)
      }

    }

    await this.lessonRepo.update(id, updateLessonDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    let lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: {
        homeworks: { files: true },
        videos: true
      }
    }) as Lesson

    if (!lesson) throw new NotFoundException(`The lesson is not found`)


    for (let hw of lesson.homeworks) {
      for (let file of hw.files) {
        try {
          unlink(join(process.cwd(), file.file))
        } catch (error) {
          console.log(error)
        }
      }
    }

    for (let videos of lesson.videos) {
      if (videos.video) {
        try {
          await unlink(join(process.cwd(), videos.video))
        } catch (error) {
          console.log(error)
        }
      }
    }

    await this.lessonRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
