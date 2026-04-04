import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { Repository } from 'typeorm';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { UserRoles } from 'src/enums';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class HomeworkService {

  constructor(@InjectRepository(Homework) private readonly homeRepo: Repository<Homework>, @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>) { }

  async create(createHomeworkDto: CreateHomeworkDto, currentUser: { id: number, role: UserRoles }): Promise<ISuccess> {
    let { lesson_id } = createHomeworkDto
    let lesson = await this.lessonRepo.findOne({
      where: { id: lesson_id },
      relations: {
        group: { users: true }
      }
    }) as Lesson

    if (!lesson) {
      throw new NotFoundException(`The lesson is not found`)
    }
    let users = lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }

    let newHomework = this.homeRepo.create({
      ...createHomeworkDto,
      lesson: lesson
    })

    await this.homeRepo.save(newHomework)
    let data = await this.homeRepo.findOne({
      where: { id: newHomework.id },
      relations: {
        lesson: true
      },
      select: {
        id: true,
        description: true,
        lesson: {
          id: true,
          title: true
        }
      }
    }) as Homework

    return {
      statusCode: 201,
      message: "created",
      data
    }
  }

  async findAll(): Promise<ISuccess> {
    let hws = await this.homeRepo.find({
      relations: {
        lesson: true
      },
      select: {
        id: true,
        description: true,
        lesson: {
          id: true,
          title: true
        }
      }
    })

    return {
      statusCode: 200,
      message: "success",
      data: hws
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.homeRepo, 'homework')
    let hw = await this.homeRepo.findOne({
      where: { id },
      relations: {
        lesson: true
      },
      select: {
        id: true,
        description: true,
        lesson: {
          id: true,
          title: true
        }
      }
    }) as Homework

    return {
      statusCode: 200,
      message: "success",
      data: hw
    }
  }

  async update(id: number, updateHomeworkDto: UpdateHomeworkDto, currentUser: { id: number, role: UserRoles }): Promise<ISuccess> {
    let homework = await this.homeRepo.findOne({
      where: { id },
      relations: {
        lesson: { group: { users: true } }
      }
    }) as Homework
    if (!homework) {
      throw new NotFoundException(`THe homework is not found`)
    }
    let users = homework.lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }
    await this.homeRepo.update(id, updateHomeworkDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    let hw = await this.homeRepo.findOne({
      where: { id },
      relations: { files: true }
    }) as Homework

    for (let file of hw?.files) {
      try {
        await unlink(join(process.cwd(), file.file))
      } catch (error) {
        console.log(error)
      }
    }

    await this.homeRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
