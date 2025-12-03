import { Controller, Post, Body } from '@nestjs/common';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';

@Controller('founder')
export class FounderController {
  constructor(private readonly founderService: FounderService) {}

  @Post('signup')
  async signup(@Body() dto: CreateFounderDto) {
    return this.founderService.signup(dto);
  }
  
}
