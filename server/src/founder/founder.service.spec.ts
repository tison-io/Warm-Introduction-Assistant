import { Test, TestingModule } from '@nestjs/testing';
import { FounderService } from './founder.service';

describe('FounderService', () => {
  let service: FounderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FounderService],
    }).compile();

    service = module.get<FounderService>(FounderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
