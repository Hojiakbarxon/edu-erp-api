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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('files-of-homework')
export class FilesOfHomeworkController {
  constructor(private readonly filesOfHomeworkService: FilesOfHomeworkService) { }

  @ApiOperation({ summary: 'Upload a file for homework, only SUPERADMIN, ADMIN and TEACHER can use it' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The files of the homework' },
        homework_id: { type: 'number', example: 1 },
        file: { type: 'string', format: 'binary' }
      }
    }
  })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  @UseInterceptors(FileInterceptor('file', homeworkStorage))
  create(@Body() createFilesOfHomeworkDto: CreateFilesOfHomeworkDto,
    @UploadedFile() file: Express.Multer.File, @CurrentUser() currentUser: { id: number, role: UserRoles }) {
    return this.filesOfHomeworkService.create(createFilesOfHomeworkDto, file, currentUser);
  }

  @ApiOperation({ summary: `This route is used for getting the datas of all existed Files, only authorization is required` })
  @ApiResponse({ status: 200, description: `success` })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.filesOfHomeworkService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of existed FIle by its id` })
  @ApiResponse({ status: 201, description: `success` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesOfHomeworkService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a file of homework' })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        file: { type: 'string', format: 'binary' }
      }
    }
  })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', homeworkStorage))
  update(@Param('id') id: string, @Body() updateFilesOfHomeworkDto: UpdateFilesOfHomeworkDto, @CurrentUser() currentUser: { id: number, role: UserRoles }, @UploadedFile() file: Express.Multer.File) {
    return this.filesOfHomeworkService.update(+id, updateFilesOfHomeworkDto, currentUser, file);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed File by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `deleted successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesOfHomeworkService.remove(+id);
  }
}
