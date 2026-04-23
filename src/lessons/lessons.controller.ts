import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/enums';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) { }

  @ApiOperation({ summary: "This route is used for creating a new Lesson, only SUPERADMIN, ADMIN and TEACHER are able to use it" })
  @ApiResponse({ status: 201, description: `A new Lesson has been created successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.lessonsService.create(createLessonDto, currentUser);
  }

  @ApiOperation({ summary: `This route is used for getting the datas of all existed Lessons, only authorization is required` })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of existed Lesson by its id, only authorization is required` })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating the datas of existed Lesson by its id, only SUPERADMIN, ADMIN, and TEACHER who belongs to the group of this lesson are able to do it` })
  @ApiResponse({ status: 200, description: `A  Lesson's datas has been updated successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.lessonsService.update(+id, updateLessonDto, currentUser);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Lesson by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `A Lesson is deleted successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);    
  }
}
