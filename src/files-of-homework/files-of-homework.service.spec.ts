import { Test, TestingModule } from '@nestjs/testing';
import { FilesOfHomeworkService } from './files-of-homework.service';

describe('FilesOfHomeworkService', () => {
  let service: FilesOfHomeworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesOfHomeworkService],
    }).compile();

    service = module.get<FilesOfHomeworkService>(FilesOfHomeworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
