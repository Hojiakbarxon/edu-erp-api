import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VideosOfLessonsService } from './videos-of-lessons.service';
import { CreateVideosOfLessonDto } from './dto/create-videos-of-lesson.dto';
import { UpdateVideosOfLessonDto } from './dto/update-videos-of-lesson.dto';
import { UserRoles } from 'src/enums';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('videos-of-lessons')
export class VideosOfLessonsController {
  constructor(private readonly videosOfLessonsService: VideosOfLessonsService) { }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createVideosOfLessonDto: CreateVideosOfLessonDto) {
    return this.videosOfLessonsService.create(createVideosOfLessonDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.videosOfLessonsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosOfLessonsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideosOfLessonDto: UpdateVideosOfLessonDto) {
    return this.videosOfLessonsService.update(+id, updateVideosOfLessonDto);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosOfLessonsService.remove(+id);
  }
}
