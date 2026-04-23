import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from 'src/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Crypto } from 'src/utils/Crypto';
import { ISuccess } from 'src/utils/success.response';
import { Conflicts } from 'src/utils/check-existance';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }

  async create(createUserDto: CreateUserDto, role: UserRoles): Promise<ISuccess> {
    let { username, phone_number, email, password } = createUserDto

    if (username) await Conflicts.mustBeUnique({ username }, this.userRepo, "user", "username")

    if (email) await Conflicts.mustBeUnique({ email }, this.userRepo, "user", "email")

    await Conflicts.mustBeUnique({ phone_number }, this.userRepo, "user", "phone number")

    let hashedPassword = await Crypto.hash(password)  

    let newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
      role
    })
    await this.userRepo.save(newUser)
    let { password: userpass, ...userWithoutPassword } = newUser

    return {
      statusCode: 201,
      message: "created",
      data: userWithoutPassword
    }
  }

  async findAll(): Promise<ISuccess> {
    let users = await this.userRepo.find({
      select: {
        id: true,
        full_name: true,
        phone_number: true,
        image: true,
        role: true
      }
    })

    return {
      statusCode: 200,
      message: 'success',
      data: users
    }
  }

  async findOne(id: number): Promise<ISuccess> {
    let user = await Conflicts.mustExist({ id }, this.userRepo, "user", {
      id: true,
      full_name: true,
      phone_number: true,
      image: true,
      role: true
    })

    return {
      statusCode: 200,
      message: "success",
      data: user
    }
  }

  async findByEmail(email: string): Promise<ISuccess> {
    let user = await this.userRepo.findOne({
      where: { email }
    }) as User
    return {
      statusCode: 200,
      message: "success",
      data: user
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ISuccess> {
    let { phone_number, email, username } = updateUserDto
    await Conflicts.mustExist({ id }, this.userRepo, "user")

    if (username) {
      await Conflicts.mustBeUniqueOnUpdate(id, { username }, this.userRepo, "user", "username")
    }

    if (email) {
      await Conflicts.mustBeUniqueOnUpdate(id, { email }, this.userRepo, "user", "email")
    }


    if (phone_number) {
      await Conflicts.mustBeUniqueOnUpdate(id, { phone_number }, this.userRepo, "user", "phone number")
    }

    let updatedUser = await this.userRepo.update(id, updateUserDto)

    let user = await Conflicts.mustExist({ id }, this.userRepo, "user", {
      id: true,
      full_name: true,
      phone_number: true,
      image: true,
      role: true
    })

    return {
      statusCode: 200,
      message: "updated",
      data: user
    }
  }
  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.userRepo, "user")
    await this.userRepo.delete({ id })
    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
