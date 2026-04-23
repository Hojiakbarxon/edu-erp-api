import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { UserRoles } from 'src/enums';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) { }

  @ApiOperation({ summary: "This route is used for creating a new Homework, only SUPERADMIN,ADMIN and TEACHER who belongs to the same group as the owner of the lesson, are able to use it" })
  @ApiResponse({ status: 201, description: `A new Homework has been created successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.homeworkService.create(createHomeworkDto, currentUser);
  }
  @ApiOperation({ summary: `This route is used for getting the datas of all existed Homeworks, only authorization is required` })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.homeworkService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of existed Homework by its id` })
  @ApiResponse({ status: 200, description: `Success` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating the datas of existed Homework by its id` })
  @ApiResponse({ status: 200, description: `success` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.homeworkService.update(+id, updateHomeworkDto, currentUser);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Homework by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `deleted, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(+id);
  }
}
