import { Test, TestingModule } from '@nestjs/testing';
import { StartupsController } from './startups.controller';
import { StartupsService } from './startups.service';

describe('StartupsController', () => {
  let controller: StartupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupsController],
      providers: [StartupsService],
    }).compile();

    controller = module.get<StartupsController>(StartupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
