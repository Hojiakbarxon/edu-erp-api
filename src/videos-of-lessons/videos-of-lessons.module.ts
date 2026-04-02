import { Module } from '@nestjs/common';
import { VideosOfLessonsService } from './videos-of-lessons.service';
import { VideosOfLessonsController } from './videos-of-lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoOfLesson } from './entities/videos-of-lesson.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoOfLesson, Lesson])
  ],
  controllers: [VideosOfLessonsController],
  providers: [VideosOfLessonsService],
})
export class VideosOfLessonsModule { }
