import { Controller, Post, Body, Param, Patch, UseGuards, Get, Req, Query, Delete, } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformIntroDto } from './dto/transform-intro.dto';
import { SendIntroDto } from './dto/send-intro.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

@Controller('intros')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post('transform')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async transformIntro(@Body() dto: TransformIntroDto, @Req() req: any) {
    return this.transformService.transformIntro(dto, req.user.userId);
  }

  @Get('my-queue')
  @UseGuards(JwtAuthGuard, AccessGuard) 
  async getMyIntros(@Req() req: any, @Query('workspaceId') workspaceId?:string, @Query('search') search?: string, @Query('page') page: number = 1) {
    const pageNumber = Math.max(1, Number(page));

    return this.transformService.getIntros(
      req.user.userId,
      workspaceId,
      search,
      pageNumber
    );
  }

  @Post('queue')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async queue(@Body() data: any, @Req() req: any) {
    return this.transformService.queueIntro(data, req.user.userId);
  }

  @Get('outcomes/history')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async getHistory(
    @Req() req: any,
    @Query('workspaceId') workspaceId?: string
  ) {
    return this.transformService.getOutcomeLogs(req.user.userId, workspaceId);
  }

  @Get('metrics/execution-rate')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async getRate(@Req() req: any, @Query('workspaceId') workspaceId?: string) {
    const rate = await this.transformService.getExecutionRate(req.user.userId, workspaceId);
    return { executionRate: rate };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async updateIntro(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { investorEmail?: string; generatedIntro?: string }
  ) {
    return this.transformService.updateIntro(id, req.user.userId, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.transformService.remove(id, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { status?: 'queued' | 'sent' | 'completed'; followUpDueDate?: Date }
  ) {
    return this.transformService.updateIntroStatus(
      id, 
      req.user.userId, 
      body.status, 
      body.followUpDueDate
    );
  }

  @Post(':id/request-consent')
  @UseGuards(JwtAuthGuard, AccessGuard)
  async requestConsent(@Param('id') id: string) {
    return this.transformService.requestInvestorConsent(id);
  }

  @Post(':id/approve')
  @UseGuards()
  async approveIntro(@Param('id') id: string, @Body('email') email: string) {
    return this.transformService.processApproval(id, email);
  }
}
