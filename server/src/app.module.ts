import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FounderModule } from './founder/founder.module';
import { AuthModule } from './auth/auth.module';
import { InvestorsModule } from './investors/investors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    AuthModule,
    InvestorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
