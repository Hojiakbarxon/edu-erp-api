import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Major } from 'src/major/entities/major.entity';
import { Group } from './entities/group.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Major, Room, Group])
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule { }
