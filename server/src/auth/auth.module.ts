import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Founder, FounderSchema } from '../founder/entities/founder.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { MailModule } from '../mail/mail.module'; // 1. ADD THIS IMPORT

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Founder.name, schema: FounderSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule,
    MailModule, // 2. ADD THIS TO THE IMPORTS ARRAY
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    GoogleStrategy,
  ],
  exports: [AuthService, JwtModule] 
})
export class AuthModule {}