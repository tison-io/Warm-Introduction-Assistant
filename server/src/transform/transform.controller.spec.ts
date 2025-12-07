import { Test, TestingModule } from '@nestjs/testing';
import { TransformController } from './transform.controller';
import { TransformService } from './transform.service';

describe('TransformController', () => {
  let controller: TransformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransformController],
      providers: [TransformService],
    }).compile();

    controller = module.get<TransformController>(TransformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
