import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FilesOfHomeworkService } from './files-of-homework.service';
import { CreateFilesOfHomeworkDto } from './dto/create-files-of-homework.dto';
import { UpdateFilesOfHomeworkDto } from './dto/update-files-of-homework.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { UserRoles } from 'src/enums';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('files-of-homework')
export class FilesOfHomeworkController {
  constructor(private readonly filesOfHomeworkService: FilesOfHomeworkService) { }
  
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN, UserRoles.TEACHER)
  @Post()
  create(@Body() createFilesOfHomeworkDto: CreateFilesOfHomeworkDto) {
    return this.filesOfHomeworkService.create(createFilesOfHomeworkDto);
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
  update(@Param('id') id: string, @Body() updateFilesOfHomeworkDto: UpdateFilesOfHomeworkDto) {
    return this.filesOfHomeworkService.update(+id, updateFilesOfHomeworkDto);
  }

  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesOfHomeworkService.remove(+id);
  }
}
