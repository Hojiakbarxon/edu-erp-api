import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UserRoles } from 'src/enums';
import { RoleGurd } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @ApiOperation({ summary: "This route is used for creating a new Room, only SUPERADMIN and ADMIN are able to use it" })
  @ApiResponse({ status: 201, description: `A new Major has been created successfully` })
  @ApiResponse({ status: 409, description: `name property of the Room is existed already in other rooms` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @ApiOperation({ summary: `This route is used for getting the datas of all existed Rooms, only authorization is required` })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of the specific Room by its id, only authorization is required` })
  @ApiResponse({ status: 200, description: `All datas are got, successfully` })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating the datas of existed Room by its id` })
  @ApiResponse({ status: 200, description: `A  Room's datas has been updated successfully` })
  @ApiResponse({ status: 409, description: "name property is already exist in another Room" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Room by its id, only SUPERADMIN and ADMIN are able to do it` })
  @ApiResponse({ status: 200, description: `A Room is deleted successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
