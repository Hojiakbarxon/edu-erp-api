import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MajorModule } from './major/major.module';
import { Major } from './major/entities/major.entity';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { Room } from './rooms/entities/room.entity';
import { User } from './users/entities/user.entity';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';
import { LessonsModule } from './lessons/lessons.module';
import { Lesson } from './lessons/entities/lesson.entity';
import { HomeworkModule } from './homework/homework.module';
import { Homework } from './homework/entities/homework.entity';
import { FilesOfHomeworkModule } from './files-of-homework/files-of-homework.module';
import { FileOfHomework } from './files-of-homework/entities/files-of-homework.entity';
import { VideosOfLessonsModule } from './videos-of-lessons/videos-of-lessons.module';
import { VideoOfLesson } from './videos-of-lessons/entities/videos-of-lesson.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    })
    , TypeOrmModule.forRoot({
      type: "postgres",
      url: String(process.env.DB_URL),
      synchronize: true,
      entities: [Major, Room, User, Group, Lesson, Homework, FileOfHomework, VideoOfLesson]
    }), MajorModule, RoomsModule, UsersModule, GroupsModule, LessonsModule, HomeworkModule, FilesOfHomeworkModule, VideosOfLessonsModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
