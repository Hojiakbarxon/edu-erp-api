import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesOfHomeworkService } from './files-of-homework.service';
import { CreateFilesOfHomeworkDto } from './dto/create-files-of-homework.dto';
import { UpdateFilesOfHomeworkDto } from './dto/update-files-of-homework.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { UserRoles } from 'src/enums';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { homeworkStorage } from 'src/utils/storage-control';

@Controller('files-of-homework')
export class FilesOfHomeworkController {
  constructor(private readonly filesOfHomeworkService: FilesOfHomeworkService) { }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  @UseInterceptors(FileInterceptor('file', homeworkStorage))
  create(@Body() createFilesOfHomeworkDto: CreateFilesOfHomeworkDto,
    @UploadedFile() file: Express.Multer.File, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.filesOfHomeworkService.create(createFilesOfHomeworkDto, file, currentUser);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.filesOfHomeworkService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesOfHomeworkService.findOne(+id);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', homeworkStorage))
  update(@Param('id') id: string, @Body() updateFilesOfHomeworkDto: UpdateFilesOfHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() file: Express.Multer.File) {
    return this.filesOfHomeworkService.update(+id, updateFilesOfHomeworkDto, currentUser, file);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesOfHomeworkService.remove(+id);
  }
}
