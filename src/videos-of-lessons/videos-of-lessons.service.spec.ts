import { Test, TestingModule } from '@nestjs/testing';
import { VideosOfLessonsService } from './videos-of-lessons.service';

describe('VideosOfLessonsService', () => {
  let service: VideosOfLessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideosOfLessonsService],
    }).compile();

    service = module.get<VideosOfLessonsService>(VideosOfLessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
