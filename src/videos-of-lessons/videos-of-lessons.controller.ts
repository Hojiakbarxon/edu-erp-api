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
import { videoStorage } from 'src/utils/storage-control';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('videos-of-lessons')
export class VideosOfLessonsController {
  constructor(private readonly videosOfLessonsService: VideosOfLessonsService) { }
  @ApiOperation({ summary: `Upload a video for the lesson, only SUPERADMIN, ADMIN, and TEACHER who is in the same group as lesson can use it` })
  @ApiResponse({ status: 201, description: `Video uploaded successfully` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "video of the lesson" },
        video: { type: 'string', format: 'binary' },
        lesson_id: { type: "number", example: 7 }
      }
    }
  })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  @UseInterceptors(FileInterceptor('video', videoStorage))
  create(@Body() createVideosOfLessonDto: CreateVideosOfLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() video: Express.Multer.File) {
    return this.videosOfLessonsService.create(createVideosOfLessonDto, currentUser, video);
  }

  @ApiOperation({ summary: `This route is used for getting the datas of all existed Rooms, only authorization is required` })
  @ApiResponse({ status: 200, description: 'success' })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.videosOfLessonsService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of existed Video by its id` })
  @ApiResponse({ status: 200, description: `success` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosOfLessonsService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating existed Video by its ID, only SUPERADMIN, ADMIN and the TEACHER who is in the same group can use it` })
  @ApiResponse({ status: 200, description: 'updated, successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "video of the lesson" },
        video: { type: 'string', format: 'binary' }
      }
    }
  })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('video', videoStorage))
  update(@Param('id') id: string, @Body() updateVideosOfLessonDto: UpdateVideosOfLessonDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() videoFile: Express.Multer.File) {
    return this.videosOfLessonsService.update(+id, updateVideosOfLessonDto, currentUser, videoFile);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Video by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `A Video is deleted successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosOfLessonsService.remove(+id);
  }
}
