import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express'; 
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    // 1. Forgot Password Endpoint
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    // 2. Google OAuth Callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
        const founder = req.user; 

        const tokenPayload = this.authService.generateJwt(founder);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        
const callbackUrl = (req.query.state as string) || '/dashboard';

        // Set the JWT as an HTTP-only cookie
        res.cookie('jwt', tokenPayload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 1 day 
        });

        // Redirect the user back to the Next.js frontend
        return res.redirect(
            `${frontendUrl}/login/success?token=${tokenPayload.token}&callbackUrl=${encodeURIComponent(callbackUrl)}`
        );
        );
    }
}