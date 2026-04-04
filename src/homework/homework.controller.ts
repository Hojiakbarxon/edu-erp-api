import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { UserRoles } from 'src/enums';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) { }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createHomeworkDto: CreateHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.homeworkService.create(createHomeworkDto, currentUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.homeworkService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.homeworkService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHomeworkDto: UpdateHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.homeworkService.update(+id, updateHomeworkDto, currentUser);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.homeworkService.remove(+id);
  }
}
