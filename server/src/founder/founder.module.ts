import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Founder, FounderSchema } from './entities/founder.entity';
import { FounderService } from './founder.service';
import { FounderController } from './founder.controller';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
    }),
    MongooseModule.forFeature([
      {name: Founder.name, schema: FounderSchema},
    ]),
  ],
  controllers: [FounderController],
  providers: [FounderService, JwtStrategy],
})
export class FounderModule {}
