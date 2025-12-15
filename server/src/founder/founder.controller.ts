import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import { FounderService } from './founder.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Req } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';

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

  @Post('login/google')
  async googleLogin() {
    return this.founderService.socialLogin('google');
  }

  @Post('login/apple')
  async appleLogin() {
    return this.founderService.socialLogin('apple');
  }

  @Post('login/facebook')
  async facebookLogin() {
    return this.founderService.socialLogin('facebook');
  }

  @Post('signup/google')
  async googleSignup() {
    return this.founderService.socialSignup('google');
  }

  @Post('signup/apple')
  async appleSignup() {
    return this.founderService.socialSignup('apple');
  }

  @Post('signup/facebook')
  async facebookSignup() {
    return this.founderService.socialSignup('facebook');
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    return this.founderService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateDto: UpdateFounderDto) {
    return this.founderService.updateProfile(req.user.userId, updateDto);
  }
}
