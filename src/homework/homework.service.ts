import { Injectable } from '@nestjs/common';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { Repository } from 'typeorm';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Injectable()
export class HomeworkService {

  constructor(@InjectRepository(Homework) private readonly homeRepo: Repository<Homework>, @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>) { }

  async create(createHomeworkDto: CreateHomeworkDto): Promise<ISuccess> {
    let { lesson_id } = createHomeworkDto
    let lesson = await Conflicts.mustExist({ id: lesson_id }, this.lessonRepo, 'lesson')

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

  async update(id: number, updateHomeworkDto: UpdateHomeworkDto): Promise<ISuccess> {
    await Conflicts.mustExist({id}, this.homeRepo, 'homework')
    await this.homeRepo.update(id, updateHomeworkDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.homeRepo, 'homework')

    await this.homeRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
