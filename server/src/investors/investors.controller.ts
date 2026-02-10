import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('investors')
@UseGuards(JwtAuthGuard, AccessGuard)
export class InvestorsController {
  constructor(private readonly investorsService: InvestorsService) {}

  @Post()
  create(@Body() createInvestorDto: CreateInvestorDto, @Request() req: AuthenticatedRequest) {
    return this.investorsService.create(createInvestorDto, req.user.userId);
  }

  @Get()
  async getInvestors(@Query('search') search: string, @Query('workspaceId') workspaceId: string, @Query('page') page: string, @Query('limit') limit: string, @Req() req: AuthenticatedRequest) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 5;

    return this.investorsService.findAll(
      req.user.userId,
      workspaceId,
      search,
      pageNum,
      limitNum
    )
  }

  @Get('analytics/velocity') 
  async getVelocity(
    @Query('workspaceId') workspaceId: string, 
    @Req() req: AuthenticatedRequest
  ) {
    return this.investorsService.getFundraisingVelocity(req.user.userId, workspaceId);
  }

  @Get('recommendations')
  async getRecommendations(
    @Query('workspaceId') workspaceId: string, 
    @Query('startupId') startupId: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.investorsService.getRecommendations(
      req.user.userId, 
      workspaceId, 
      startupId
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.investorsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestorDto: UpdateInvestorDto, @Request() req: AuthenticatedRequest) {
    return this.investorsService.update(id, updateInvestorDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.investorsService.remove(id, req.user.userId);
  }
}