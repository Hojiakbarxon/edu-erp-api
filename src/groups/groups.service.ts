import { ConflictException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { Major } from 'src/major/entities/major.entity';
import { User } from 'src/users/entities/user.entity';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';
import { Room } from 'src/rooms/entities/room.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class GroupsService {

  constructor(@InjectRepository(Group) private readonly groupRepo: Repository<Group>, @InjectRepository(Major) private readonly majorRepo: Repository<Major>, @InjectRepository(User) private readonly userRepo: Repository<User>, @InjectRepository(Room) private readonly roomRepo: Repository<Room>) { }

  async create(createGroupDto: CreateGroupDto): Promise<ISuccess> {
    let { name, major_id, room_id } = createGroupDto
    await Conflicts.mustBeUnique({ name }, this.groupRepo, 'group', "name")

    let major = await Conflicts.mustExist({ id: major_id }, this.majorRepo, 'major')

    let room = await Conflicts.mustExist({ id: room_id }, this.roomRepo, 'room')

    let newGroup = this.groupRepo.create({
      ...createGroupDto,
      major,
      room
    })
    await this.groupRepo.save(newGroup)

    let group = await this.groupRepo.findOne({
      where: { id: newGroup.id },
      relations: {
        major: true,
        room: true
      }
    }) as Group

    return {
      statusCode: 201,
      message: "created",
      data: group
    }

  }

  async findAll(): Promise<ISuccess> {
    let groups = await this.groupRepo.find({
      relations: {
        major: true,
        room: true
      }
    })

    return {
      statusCode: 200,
      message: "success",
      data: groups
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.groupRepo, "group")

    let group = await this.groupRepo.findOne({
      where: { id },
      relations: {
        major: true,
        room: true,
        users: true
      }
    }) as Group

    return {
      statusCode: 200,
      message: "success",
      data: group
    }
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.groupRepo, 'group')

    let { name, start_date, end_date, duration, days, room_id } = updateGroupDto
    if (name) {
      await Conflicts.mustBeUniqueOnUpdate(id, { name }, this.groupRepo, "group", 'name')
    }
    if (room_id) {
      let room = await Conflicts.mustExist({ id: room_id }, this.roomRepo, 'room')
      await this.groupRepo.update(id, {
        room
      })
    }

    await this.groupRepo.update(id, {
      name: updateGroupDto?.name,
      start_date: updateGroupDto?.start_date,
      end_date: updateGroupDto?.end_date,
      duration: updateGroupDto?.duration,
      days: updateGroupDto?.days
    })

    let group = await this.groupRepo.findOne({
      where: { id },
      relations: {
        major: true,
        room: true
      }
    }) as Group

    return {
      statusCode: 200,
      message: "updated",
      data: group
    }
  }

  async remove(id: number): Promise<ISuccess> {
    let group = await this.groupRepo.findOne({
      where: { id },
      relations: {
        lessons: { homeworks: { files: true }, videos: true }
      }
    }) as Group

    for (let ls of group.lessons) {
      for (let hw of ls.homeworks) {
        for (let file of hw.files) {
          try {
            await unlink(join(process.cwd(), file.file))
          } catch (error) {
            console.log(error)
          }
        }
      }
    }

    for (let ls of group.lessons) {
      for (let video of ls.videos) {
        try {
          await unlink(join(process.cwd(), video.video))
        } catch (error) {
          console.log(error)
        }
      }
    }

    await this.groupRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }

  async addUserToGroup(grop_id: number, user_id: number): Promise<ISuccess> {
      await Conflicts.mustExist({ id: grop_id }, this.groupRepo, 'group')

      let group = await this.groupRepo.findOne({
        where: { id: grop_id },
        relations: { users: true }
      }) as Group

      let user = await Conflicts.mustExist({ id: user_id }, this.userRepo, "user")

      let alreadyIn = group?.users.some(user => user.id === user_id)
      if (alreadyIn) {
        throw new ConflictException(`User already in this group`)
      }
      group?.users.push(user)

      await this.groupRepo.save(group)

    return {
      statusCode: 200,
      message: "User has been added to the group successfully",
      data: {}
    }
  }
  async removeUserFromGroup(grop_id: number, user_id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id: grop_id }, this.groupRepo, 'group')

    let group = await this.groupRepo.findOne({
      where: { id: grop_id },
      relations: { users: true }
    }) as Group

    let user = await Conflicts.mustExist({ id: user_id }, this.userRepo, "user")

    let index = group?.users.findIndex(user => user.id === user_id)
    if (index === -1) {
      throw new ConflictException(`User is not in this group`)
    }
    group?.users.splice(index, 1)

    await this.groupRepo.save(group)

    return {
      statusCode: 200,
      message: "User has been removed from the group successfully",
      data: {}
    }
  }
}
