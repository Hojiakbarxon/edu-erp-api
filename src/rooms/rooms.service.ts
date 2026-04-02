import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly roomRepo: Repository<Room>) { }
  async create(createRoomDto: CreateRoomDto): Promise<ISuccess> {
    let { name } = createRoomDto
    await Conflicts.mustBeUnique({ name }, this.roomRepo, "room", "name")

    let newRoom = this.roomRepo.create(createRoomDto)
    await this.roomRepo.save(newRoom)

    return {
      statusCode: 201,
      message: "created",
      data: newRoom
    }
  }

  async findAll(): Promise<ISuccess> {
    let rooms = await this.roomRepo.find()

    return {
      statusCode: 200,
      message: "success",
      data: rooms
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let room = await Conflicts.mustExist({ id }, this.roomRepo, 'room')

    return {
      statusCode: 200,
      message: "success",
      data: room
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.roomRepo, 'room')
    let { name } = updateRoomDto
    if (name) {
      await Conflicts.mustBeUniqueOnUpdate(id, { name }, this.roomRepo, 'room', 'name')
    }

    await this.roomRepo.update(id, updateRoomDto)

    let updatedRoom = await this.roomRepo.findOne({ where: { id } }) as Room
    return {
      statusCode: 200,
      message: "updated",
      data: updatedRoom
    }
  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.roomRepo, 'room')

    await this.roomRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }

  }
}
