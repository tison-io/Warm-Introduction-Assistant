import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('founder')
export class FounderController {
  constructor(private readonly founderService: FounderService) {}

  @Post('signup')
  async signup(@Body() dto: CreateFounderDto) {
    return this.founderService.signup(dto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.founderService.login(loginDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.founderService.getUserProfile(req.user.userId);
  }
}
