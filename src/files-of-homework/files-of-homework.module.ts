import { Module } from '@nestjs/common';
import { FilesOfHomeworkService } from './files-of-homework.service';
import { FilesOfHomeworkController } from './files-of-homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { FileOfHomework } from './entities/files-of-homework.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileOfHomework, Homework])
  ],
  controllers: [FilesOfHomeworkController],
  providers: [FilesOfHomeworkService],
})
export class FilesOfHomeworkModule { }
