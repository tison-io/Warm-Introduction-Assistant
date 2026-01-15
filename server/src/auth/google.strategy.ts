import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

        // Add a check to ensure configuration is available
        if (!clientID || !clientSecret || !callbackURL) {
            throw new UnauthorizedException('Google OAuth configuration is missing.');
        }

        super({
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: callbackURL,
            scope: ['email', 'profile'],    
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, id } = profile;

        const userProfile = {
            googleId: id,
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
        };

        const founder = await this.authService.validateSocialUser(userProfile);

        done(null, founder);
    }
}
