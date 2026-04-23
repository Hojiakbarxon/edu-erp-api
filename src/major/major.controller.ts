import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { UserRoles } from 'src/enums';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) { }

  @ApiOperation({ summary: "This route is used for creating a new Major, only SUPERADMIN and ADMIN are able to use it" })
  @ApiResponse({ status: 201, description: `A new Major has been created successfully` })
  @ApiResponse({ status: 409, description: `Some properties of the Major is existed already in other majors` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post()
  create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorService.create(createMajorDto);
  }

  @ApiOperation({ summary: "This route is used for getting the datas of all existed Majors only authorization is required" })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.majorService.findAll();
  }

  @ApiOperation({ summary: "This route is used for getting the datas of the specific Major by its Id only authorization is required" })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.majorService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating the datas of existing Major, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `A  Major's datas has been updated successfully` })
  @ApiResponse({ status: 409, description: `Some properties of the Major is existed alread in other majors` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMajorDto: UpdateMajorDto) {
    return this.majorService.update(+id, updateMajorDto);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Major by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `A Major has been deleted, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.majorService.remove(+id);
  }
}
