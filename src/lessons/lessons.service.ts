import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { ISuccess } from 'src/utils/success.response';
import { Conflicts } from 'src/utils/check-existance';

@Injectable()
export class LessonsService {
  constructor(@InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>, @InjectRepository(Group) private readonly groupRepo: Repository<Group>) { }

  async create(createLessonDto: CreateLessonDto): Promise<ISuccess> {

    let { title, group_id } = createLessonDto
    let group = await Conflicts.mustExist({ id: group_id }, this.groupRepo, "group")

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

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<ISuccess> {
    let lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: { group: true }
    })
    if (!lesson) {
      throw new NotFoundException(`The lesson is  not found`)
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

    let updatedLesson = await this.lessonRepo.update(id, updateLessonDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.lessonRepo, 'lesson')

    await this.lessonRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
