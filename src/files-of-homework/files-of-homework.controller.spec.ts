import { Test, TestingModule } from '@nestjs/testing';
import { FilesOfHomeworkController } from './files-of-homework.controller';
import { FilesOfHomeworkService } from './files-of-homework.service';

describe('FilesOfHomeworkController', () => {
  let controller: FilesOfHomeworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesOfHomeworkController],
      providers: [FilesOfHomeworkService],
    }).compile();

    controller = module.get<FilesOfHomeworkController>(FilesOfHomeworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
