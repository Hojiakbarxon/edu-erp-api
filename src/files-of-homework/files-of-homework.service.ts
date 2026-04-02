import { Injectable } from '@nestjs/common';
import { CreateFilesOfHomeworkDto } from './dto/create-files-of-homework.dto';
import { UpdateFilesOfHomeworkDto } from './dto/update-files-of-homework.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { FileOfHomework } from './entities/files-of-homework.entity';
import { ISuccess } from 'src/utils/success.response';
import { ConfigModule } from '@nestjs/config';
import { Conflicts } from 'src/utils/check-existance';

@Injectable()
export class FilesOfHomeworkService {
  constructor(@InjectRepository(FileOfHomework) private readonly filesRepo: Repository<FileOfHomework>, @InjectRepository(Homework) private readonly hwRepo: Repository<Homework>) { }

  async create(createFilesOfHomeworkDto: CreateFilesOfHomeworkDto): Promise<ISuccess> {

    let { homework_id } = createFilesOfHomeworkDto
    let hw = await Conflicts.mustExist({ id: homework_id }, this.hwRepo, 'homework')

    let newFile = this.filesRepo.create({ ...createFilesOfHomeworkDto, homework: hw })
    await this.filesRepo.save(newFile)

    let data = await this.filesRepo.findOne({
      where: { id: newFile.id },
      relations: {
        homework: true
      }
    }) as FileOfHomework

    return {
      statusCode: 201,
      message: "created",
      data
    }
  }

  async findAll(): Promise<ISuccess> {
    let files = await this.filesRepo.find({
      relations: {
        homework: true
      }
    })

    return {
      statusCode: 200,
      message: "success",
      data: files
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.filesRepo, "homework file ")
    let file = await this.filesRepo.findOne({
      where: { id },
      relations: {
        homework: true
      }
    }) as FileOfHomework

    return {
      statusCode: 200,
      message: "success",
      data: file
    }
  }

  async update(id: number, updateFilesOfHomeworkDto: UpdateFilesOfHomeworkDto): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.filesRepo, 'homework file')

    await this.filesRepo.update(id, updateFilesOfHomeworkDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.filesRepo, 'homework file')

    await this.filesRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
