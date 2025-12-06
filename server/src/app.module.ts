import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Module, BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FounderModule } from './founder/founder.module';

import { InvestorsModule } from './investors/investors.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MailService } from './mail/mail.service';
import { ContactModule } from './contact/contact.module';
import { StartupsModule } from './startups/startups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
