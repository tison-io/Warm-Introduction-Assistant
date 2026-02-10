import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { FounderDocument } from 'src/founder/entities/founder.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const founder = req.user as FounderDocument;

        const tokenPayload = this.authService.generateJwt(founder);

        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        
        const callbackUrl = (req.query.state as string) || '/dashboard'
        res.cookie('jwt', tokenPayload.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, 
        });

        return res.redirect(
            `${frontendUrl}/login/success?token=${tokenPayload.token}&callbackUrl=${encodeURIComponent(callbackUrl)}`
        );
    }
}