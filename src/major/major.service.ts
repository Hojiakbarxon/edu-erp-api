import { Injectable } from '@nestjs/common';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { ISuccess } from 'src/utils/success.response';
import { Conflicts } from 'src/utils/check-existance';

@Injectable()
export class MajorService {
  constructor(@InjectRepository(Major) private readonly majorRepo: Repository<Major>) { }
  async create(createMajorDto: CreateMajorDto): Promise<ISuccess> {
    let { name } = createMajorDto
    await Conflicts.mustBeUnique({ name }, this.majorRepo, 'major', 'name')
    let newMajor = this.majorRepo.create(createMajorDto)
    await this.majorRepo.save(newMajor)

    return {
      statusCode: 201,
      message: "created",
      data: newMajor
    }
  }

  async findAll(): Promise<ISuccess> {
    let majors = await this.majorRepo.find()
    return {
      statusCode: 200,
      message: "success",
      data: majors
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let major = await Conflicts.mustExist({ id }, this.majorRepo, "major")
    return {
      statusCode: 200,
      message: 'success',
      data: major
    }
  }

  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.majorRepo, 'major')
    let { name } = updateMajorDto
    if (name) {
      await Conflicts.mustBeUniqueOnUpdate(id, { name }, this.majorRepo, 'major', "name")
    }
    await this.majorRepo.update(id, updateMajorDto)
    let major = await this.majorRepo.findOneBy({ id }) as Major

    return {
      statusCode: 200,
      message: "updated",
      data: major
    }

  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.majorRepo, 'major')
    await this.majorRepo.delete({ id })
    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }

  }
}
