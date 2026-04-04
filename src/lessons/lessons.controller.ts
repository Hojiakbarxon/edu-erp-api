import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/enums';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createLessonDto: CreateLessonDto, @CurrentUser() currentUser : {id : number, role : UserRoles}) {
    return this.lessonsService.create(createLessonDto, currentUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.lessonsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto, @CurrentUser() currentUser : {id : number, role : UserRoles}) {
    return this.lessonsService.update(+id, updateLessonDto, currentUser);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(+id);
  }
}
