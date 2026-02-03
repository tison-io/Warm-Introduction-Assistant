import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from 'src/guards/access.guard';

@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Post()
  create(@Body() dto: CreateStartupDto, @Req() req:any) {
    return this.startupsService.create(dto);
  } 

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Get()
  findMyStartups(@Req() req: any) {
    return this.startupsService.findMyRequests(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.startupsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStartupDto, @Req() req: any) {
    return this.startupsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.startupsService.remove(id, req.user.userId);
  }
}
