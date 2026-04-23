import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGurd } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/enums';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @ApiOperation({ summary: `This route is used for adding the student to the group, only SUPERADMIN and ADMIN can use it` })
  @ApiResponse({ status: 200, description: `student has been added to the group, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post(":groupId/add-user/:userId")
  addUser(
    @Param("groupId") groupId: string,
    @Param("userId") userId: string
  ) {
    return this.groupsService.addUserToGroup(+groupId, +userId)
  }
  @ApiOperation({ summary: `This route is used for creating a new Group only SUPERADMIN and ADMIN can use it` })
  @ApiResponse({ status: 201, description: "created, successfully" })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }
  @ApiOperation({ summary: `This route is used for getting the datas of all existed Groups, only authorization is required` })
  @ApiResponse({ status: 200, description: "success" })
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @ApiOperation({ summary: `This route is used for getting the datas of existed Group by its ID, only authorization is required` })
  @ApiResponse({ status: 200, description: "success" })
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @ApiOperation({ summary: `This route is used for updating the datas of existed Group by its ID, only SUPERADMIN and ADMIN can use it` })
  @ApiResponse({ status: 200, description: `updated, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }


  @ApiOperation({ summary: `This route is used for deleting the student from the group, only SUPERADMIN and ADMIN can use it` })
  @ApiResponse({ status: 200, description: `student has been deleted from the group, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(":groupId/remove-user/:userId")
  removeUser(
    @Param("groupId") groupId: string,
    @Param("userId") userId: string
  ) {
    return this.groupsService.removeUserFromGroup(+groupId, +userId)
  }

  @ApiOperation({ summary: `This route is used for deleting the existed Group by its id, only SUPERADMIN and ADMIN can use it` })
  @ApiResponse({ status: 200, description: `deleted, successfully` })
  @UseGuards(AuthGuard, RoleGurd)
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
