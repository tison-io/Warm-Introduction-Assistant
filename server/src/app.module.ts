import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { Module, BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FounderModule } from './founder/founder.module';
import { InvestorsModule } from './investors/investors.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MailService } from './mail/mail.service';
import { ContactModule } from './contact/contact.module';
import { StartupsModule } from './startups/startups.module';
import { TransformModule } from './transform/transform.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');
        if (!mongoUri) {
          throw new BadRequestException('MONGO_URI environment variable is not configured');
        }
        return { uri: mongoUri };
      },
    }),
    FounderModule,
    InvestorsModule,
    SchedulerModule,
    ContactModule,
    StartupsModule,
    TransformModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
