import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports : [
    TypeOrmModule.forFeature([Homework, Lesson, User])
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService],
})
export class HomeworkModule {}
