import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideosOfLessonDto } from './dto/create-videos-of-lesson.dto';
import { UpdateVideosOfLessonDto } from './dto/update-videos-of-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoOfLesson } from './entities/videos-of-lesson.entity';
import { Repository } from 'typeorm';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Conflicts } from 'src/utils/check-existance';
import { ISuccess } from 'src/utils/success.response';

@Injectable()
export class VideosOfLessonsService {

  constructor(@InjectRepository(VideoOfLesson) private readonly vdRepo: Repository<VideoOfLesson>, @InjectRepository(Lesson) private readonly lessonRepo: Repository<Lesson>) { }

  async create(createVideosOfLessonDto: CreateVideosOfLessonDto): Promise<ISuccess> {
    let { lesson_id, title } = createVideosOfLessonDto
    let lesson = await Conflicts.mustExist({ id: lesson_id }, this.lessonRepo, 'lesson')

    let existedVideo = await this.vdRepo.findOne({
      where: { title, lesson: { id: lesson_id } }
    })
    if (existedVideo) {
      throw new ConflictException(`The video with this title already exists in this lesson`)
    }

    let newVideo = this.vdRepo.create({ ...createVideosOfLessonDto, lesson })
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

  async update(id: number, updateVideosOfLessonDto: UpdateVideosOfLessonDto): Promise<ISuccess> {
    let video = await this.vdRepo.findOne({
      where: { id },
      relations: { lesson: true }
    })
    if (!video) {
      throw new NotFoundException(`The video is not found`)
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

    await this.vdRepo.update(id, updateVideosOfLessonDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<ISuccess> {
    await Conflicts.mustExist({ id }, this.vdRepo, "video")

    await this.vdRepo.delete({ id })

    return {
      statusCode: 200,
      message: "deleted",
      data: {}
    }
  }
}
