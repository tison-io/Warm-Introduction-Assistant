import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InvestorsService } from './investors.service';
import { CreateInvestorDto } from './dto/create-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('investors')
@UseGuards(JwtAuthGuard)
export class InvestorsController {
  constructor(private readonly investorsService: InvestorsService) {}

  @Post()
  create(@Body() createInvestorDto: CreateInvestorDto, @Request() req) {
    return this.investorsService.create(createInvestorDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.investorsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.investorsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvestorDto: UpdateInvestorDto, @Request() req) {
    return this.investorsService.update(id, updateInvestorDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.investorsService.remove(id, req.user.userId);
  }
}