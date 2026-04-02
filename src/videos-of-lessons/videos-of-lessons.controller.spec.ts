import { Test, TestingModule } from '@nestjs/testing';
import { VideosOfLessonsController } from './videos-of-lessons.controller';
import { VideosOfLessonsService } from './videos-of-lessons.service';

describe('VideosOfLessonsController', () => {
  let controller: VideosOfLessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosOfLessonsController],
      providers: [VideosOfLessonsService],
    }).compile();

    controller = module.get<VideosOfLessonsController>(VideosOfLessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
