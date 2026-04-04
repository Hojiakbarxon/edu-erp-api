import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { VideosOfLessonsService } from './videos-of-lessons.service';
import { CreateVideosOfLessonDto } from './dto/create-videos-of-lesson.dto';
import { UpdateVideosOfLessonDto } from './dto/update-videos-of-lesson.dto';
import { UserRoles } from 'src/enums';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { videoStorage } from 'src/utils/storage-control';

@Controller('videos-of-lessons')
export class VideosOfLessonsController {
  constructor(private readonly videosOfLessonsService: VideosOfLessonsService) { }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  @UseInterceptors(FileInterceptor('video', videoStorage))
  create(@Body() createVideosOfLessonDto: CreateVideosOfLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() video: Express.Multer.File) {
    return this.videosOfLessonsService.create(createVideosOfLessonDto, currentUser, video);
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
  @UseInterceptors(FileInterceptor('video', videoStorage))
  update(@Param('id') id: string, @Body() updateVideosOfLessonDto: UpdateVideosOfLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() videoFile: Express.Multer.File) {
    return this.videosOfLessonsService.update(+id, updateVideosOfLessonDto, currentUser, videoFile);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosOfLessonsService.remove(+id);
  }
}
