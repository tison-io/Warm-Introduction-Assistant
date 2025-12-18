import { Controller, Post, Body, Param, Patch, UseGuards, Get, Req, } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { SendIntroDto } from './dto/send-intro.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('intros')
@UseGuards(JwtAuthGuard)
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('transform')
  async transformIntro(@Body() dto: TransformIntroDto) {
    return this.transformService.transformIntro(dto);
  }

  @Get('my-queue') 
  async getMyIntros(@Req() req: any) {
    const founderId = req.user.userId; 
    return this.transformService.getIntrosByFounder(founderId);
  }

  @Post('queue')
  async queue(@Body() data: any) {
    return this.transformService.queueIntro(data);
  }

  @Post('send-intro')
  async sendIntroEmail(@Body() dto: SendIntroDto) {
    return this.transformService.sendGeneratedIntroEmail({
      investorEmail: dto.investorEmail,
      startupName: dto.startupName,
      generatedIntro: dto.generatedIntro,
    });
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'queued' | 'sent' | 'completed'; followUpDueDate?: Date }
  ) {
    return this.transformService.updateIntroStatus(id, body.status, body.followUpDueDate);
  }
}
