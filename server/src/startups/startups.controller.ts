import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from 'src/guards/access.guard';

@Controller('startups')
@UseGuards(JwtAuthGuard, AccessGuard)
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Post()
  create(@Body() dto: CreateStartupDto, @Req() req:any) {
    return this.startupsService.create(dto, req.user.userId);
  } 

  @Get()
  findMyStartups(@Req() req: any) {
    return this.startupsService.findAllByFounder(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.startupsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStartupDto, @Req() req: any) {
    return this.startupsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.startupsService.remove(id, req.user.userId);
  }
}
