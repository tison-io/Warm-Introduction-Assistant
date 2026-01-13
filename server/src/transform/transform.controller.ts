import { Controller, Post, Body, Param, Patch, UseGuards, Get, Req, Query, Delete, } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { SendIntroDto } from './dto/send-intro.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('intros')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('transform')
  @UseGuards(JwtAuthGuard)
  async transformIntro(@Body() dto: TransformIntroDto) {
    return this.transformService.transformIntro(dto);
  }

  @Get('my-queue')
  @UseGuards(JwtAuthGuard) 
  async getMyIntros(@Req() req: any, @Query('workspaceId') workspaceId?:string) {
    const founderId = req.user.userId; 
    return this.transformService.getIntros(req.user.userId, workspaceId);
  }

  @Post('queue')
  @UseGuards(JwtAuthGuard)
  async queue(@Body() data: any, @Req() req: any) {
    return this.transformService.queueIntro(data, req.user.userId);
  }

  @Post('send-intro')
  @UseGuards(JwtAuthGuard)
  async sendIntroEmail(@Body() dto: SendIntroDto) {
    return this.transformService.sendGeneratedIntroEmail({
      investorEmail: dto.investorEmail,
      startupName: dto.startupName,
      generatedIntro: dto.generatedIntro,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.transformService.remove(id, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { status: 'queued' | 'sent' | 'completed'; followUpDueDate?: Date }
  ) {
    return this.transformService.updateIntroStatus(
      id, 
      req.user.userId, 
      body.status, 
      body.followUpDueDate
    );
  }

  //Request investor consent ---
  @Post(':id/request-consent')
  @UseGuards(JwtAuthGuard)
  async requestConsent(@Param('id') id: string) {
    return this.transformService.requestInvestorConsent(id);
  }

  //Approve intro ---
  @Post(':id/approve')
  @UseGuards()
  async approveIntro(@Param('id') id: string) {
    return this.transformService.approveInvestorIntro(id);
  }

}
