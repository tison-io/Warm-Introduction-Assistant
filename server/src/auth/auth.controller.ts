import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // or 'founder' depending on your route setup
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Endpoint for your Next.js Forgot Password page
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    // Example of a login route that uses generateJwt
    @Post('login')
    async login(@Body() loginDto: any) {
        // ... login logic ...
        // return this.authService.generateJwt(user);
    }
}