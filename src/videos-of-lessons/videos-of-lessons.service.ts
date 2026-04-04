import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideosOfLessonDto } from './dto/create-videos-of-lesson.dto';
import { UpdateVideosOfLessonDto } from './dto/update-videos-of-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoOfLesson } from './entities/videos-of-lesson.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';
import { UserRoles } from 'src/enums';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class VideosOfLessonsService {

  constructor(@InjectRepository(VideoOfLesson) private readonly vdRepo: Repository<VideoOfLesson>, @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>) { }

  async create(createVideosOfLessonDto: CreateVideosOfLessonDto, currentUser: { id: number, role: UserRoles }, video: Express.Multer.File): Promise<ISuccess> {
    if (!video) throw new BadRequestException(`Vide should not be empty`)
    let { lesson_id, title } = createVideosOfLessonDto
    let lesson = await this.lessonRepo.findOne({
      where: { id: lesson_id },
      relations: { group: { users: true } }
    }) as Lesson

    if (!lesson) {
      await unlink(join(process.cwd(), `uploads/videos/${video.filename}`))
      throw new NotFoundException(`The lesson is not found`)
    }
    let users = lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }

    let existedVideo = await this.vdRepo.findOne({
      where: { title, lesson: { id: lesson_id } }
    })
    if (existedVideo) {
      throw new ConflictException(`The video with this title already exists in this lesson`)
    }

    let videoPath = `uploads/videos/${video.filename}`
    let newVideo = this.vdRepo.create({ ...createVideosOfLessonDto, lesson, video: videoPath })
    await this.vdRepo.save(newVideo)

    let data = await this.vdRepo.findOne({
      where: { id: newVideo.id },
      relations: {
        lesson: true
      }
    }) as VideoOfLesson

    return {
      statusCode: 201,
      message: "created",
      data
    }
  }

  async findAll(): Promise<ISuccess> {
    let vds = await this.vdRepo.find({
      relations: {
        lesson: true
      },
      select: {
        id: true,
        title: true,
        video: true,
        lesson: {
          id: true,
          title: true
        }
      }
    })

    return {
      statusCode: 200,
      message: "success",
      data: vds
    }

  }

  async findOne(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.vdRepo, "video")

    let vd = await this.vdRepo.findOne({
      where: { id },
      relations: {
        lesson: true
      }
    }) as VideoOfLesson

    return {
      statusCode: 200,
      message: "success",
      data: vd
    }
  }

  async update(id: number, updateVideosOfLessonDto: UpdateVideosOfLessonDto, currentUser: { id: number, role: UserRoles }, videoFile: Express.Multer.File): Promise<ISuccess> {
    let video = await this.vdRepo.findOne({
      where: { id },
      relations: { lesson: { group: { users: true } } }
    })
    if (!video) {
      throw new NotFoundException(`The video is not found`)
    }
    let users = video.lesson.group.users
    if (currentUser.role === UserRoles.TEACHER) {
      Conflicts.checkMemebr(currentUser.id, users)
    }
    if (updateVideosOfLessonDto.title) {
      let existedVideo = await this.vdRepo.findOne({
        where: {
          title: updateVideosOfLessonDto.title,
          lesson: { id: video.lesson.id }
        }
      })
      if (existedVideo && existedVideo.id !== id) {
        throw new ConflictException(`The video already exists in this lesson`)
      }
    }

    if (videoFile) {
      let oldFIlePath = join(process.cwd(), video.video)
      try {
        await unlink(oldFIlePath)
      } catch (error) {
        console.log(error)
      }

      updateVideosOfLessonDto.video = `uploads/videos/${videoFile.filename}`
    }
    
    await this.vdRepo.update(id, updateVideosOfLessonDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    let video = await Conflicts.mustExist({ id }, this.vdRepo, "video") as VideoOfLesson

    let oldPath = join(process.cwd(), video.video)

    try {
      await unlink(oldPath)
    } catch (error) {
      console.log(error)
    }
    await this.vdRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
