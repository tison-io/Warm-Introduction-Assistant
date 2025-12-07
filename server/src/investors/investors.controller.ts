import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('investors')
@UseGuards(JwtAuthGuard)
export class InvestorsController {
  constructor(private readonly investorsService: InvestorsService) {}

  @Post()
  create(@Body() createInvestorDto: CreateInvestorDto, @Request() req: AuthenticatedRequest) {
    return this.investorsService.create(createInvestorDto, req.user.userId);
  }

  @Get()
  async getInvestors(@Query('search') search: string, @Req() req: AuthenticatedRequest) {
    return this.investorsService.findAll(req.user.userId, search);
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