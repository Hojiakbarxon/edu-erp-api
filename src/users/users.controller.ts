import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRoles } from 'src/enums';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: `This route will create a new ADMIN, and only SUPERADMIN is able to use it` })
  @ApiResponse({ status: 201, description: "a new ADMIN has been created successfully" })
  @ApiResponse({ status: 409, description: "a new user some properties like email should be unique and different from other users" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN)
  @Post('admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRoles.ADMIN);
  }

  @ApiOperation({ summary: `This route will create a new TEACHER, and only SUPERADMIN adn ADMIN are able to use it` })
  @ApiResponse({ status: 201, description: "a new TEACHER has been created successfully" })
  @ApiResponse({ status: 409, description: "a new user some properties like email should be unique and different from other users" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post('teacher')
  createTeacher(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRoles.TEACHER);
  }

  @ApiOperation({ summary: `This route will create a new STUDENT, and only SUPERADMIN adn ADMIN are able to use it` })
  @ApiResponse({ status: 201, description: "a new STUDENT has been created successfully" })
  @ApiResponse({ status: 409, description: "a new user some properties like email should be unique and different from other users" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post('student')
  createStudent(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, UserRoles.STUDENT);
  }

  @ApiOperation({ summary: "This route is used to get all of the users in the system and only SUPERADMIN and ADMIN are able to use it" })
  @ApiResponse({ status: 200, description: "All datas are successfully displayed" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @ApiOperation({ summary: "This route is for the user who wants to get his/her own datas, only beare token required" })
  @ApiResponse({ status: 200, description: "All datas are successfully displayed" })
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { id: number }) {
    return this.usersService.findOne(user?.id)
  }

  @ApiOperation({ summary: "This route is used to get tha datas of the specific user by his/her id, SUPERADMIN, ADMIN and USER with this ID are able to use it" })
  @ApiResponse({ status: 200, description: "All datas are successfully displayed" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, 'SELF')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used to update the datas of user except his/her password and role, only SUPERADMIN and ADMIN are able to use it, via bearer token, and SUPERADMIN data can be changed by only himself/herself` })
  @ApiResponse({ status: 200, description: "successfully updated" })
  @ApiResponse({ status: 409, description: "an updated user some properties like email should be unique and different from other users" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, 'SELF', UserRoles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: `This route is used to delete the user form the system, only SUPERAMIN and ADMIN are able to use it` })
  @ApiResponse({ status: 200, description: `selected user has been deleted successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
