import { Test, TestingModule } from '@nestjs/testing';
import { ImageAccessService } from './image-access.service';

describe('ImageAccessServiceService', () => {
  let service: ImageAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageAccessService],
    }).compile();

    service = module.get<ImageAccessService>(ImageAccessService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
