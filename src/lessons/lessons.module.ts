import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Group } from 'src/groups/entities/group.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Lesson, Group])
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
