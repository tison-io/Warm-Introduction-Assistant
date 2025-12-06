import { Controller, Post, Body, } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformIntroDto } from './dto/transform-intro.dto';

@Controller('intros')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('transform')
  async transformIntro(@Body() dto: TransformIntroDto) {
    return this.transformService.transformIntro(dto);
  }

  @Post('queue')
  async queue(@Body() data: any) {
    return this.transformService.queueIntro(data);
  }
}
