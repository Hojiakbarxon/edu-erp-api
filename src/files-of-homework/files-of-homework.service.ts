import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilesOfHomeworkDto } from './dto/create-files-of-homework.dto';
import { UpdateFilesOfHomeworkDto } from './dto/update-files-of-homework.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { FileOfHomework } from './entities/files-of-homework.entity';
import { ISuccess } from 'src/utils/success.response';
import { Conflicts } from 'src/utils/check-existance';
import { UserRoles } from 'src/enums';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class FilesOfHomeworkService {
  constructor(@InjectRepository(FileOfHomework) private readonly filesRepo: Repository<FileOfHomework>, @InjectRepository(Homework) private readonly hwRepo: Repository<Homework>) { }

  async create(createFilesOfHomeworkDto: CreateFilesOfHomeworkDto, file: Express.Multer.File, currentUser: { id: number, role: UserRoles }): Promise<ISuccess> {

    if (!file) {
      throw new BadRequestException(`File is required`)
    }

    let { homework_id } = createFilesOfHomeworkDto
    let hw = await this.hwRepo.findOne({
      where: { id: homework_id },
      relations: { lesson: { group: { users: true } } }
    }) as Homework

    if (!hw) {
      await unlink(join(process.cwd(), `uploads/homework/${file.filename}`)).catch(() => { })
      throw new NotFoundException(`The homework is not found`)
    }

    let users = hw.lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }
    let filePath = `uploads/homework/${file.filename}`
    let newFile = this.filesRepo.create({
      ...createFilesOfHomeworkDto,
      homework: hw,
      file: filePath
    })
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

  async update(id: number, updateFilesOfHomeworkDto: UpdateFilesOfHomeworkDto, currentUser: { id: number, role: UserRoles }, file: Express.Multer.File): Promise<ISuccess> {
    let hwFIle = await this.filesRepo.findOne({
      where: { id },
      relations: {
        homework: { lesson: { group: { users: true } } }
      }
    }) as FileOfHomework
    if (!hwFIle) {
      await unlink(join(process.cwd(), `uploads/homework/${file.filename}`)).catch(() => { })
      throw new NotFoundException(`The file is not found`)
    }
    let users = hwFIle.homework.lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }

    if (file) {
      let oldFIlePath = join(process.cwd(), hwFIle.file)
      try {
        await unlink(oldFIlePath)
      } catch (error) {
        console.log(error)
      }

      updateFilesOfHomeworkDto.file = `uploads/homework/${file.filename}`
    }

    await this.filesRepo.update(id, updateFilesOfHomeworkDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    let hwFIle = await Conflicts.mustExist({ id }, this.filesRepo, 'homework file') as FileOfHomework

    let oldFIlePath = join(process.cwd(), hwFIle.file)
    try {
      await unlink(oldFIlePath)
    } catch (error) {
      console.log(error)
    }
    await this.filesRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
