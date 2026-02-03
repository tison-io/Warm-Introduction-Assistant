import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Startup, StartupSchema } from './entities/startup.entity';
import { FounderModule } from 'src/founder/founder.module';
import { AccessGuard } from 'src/guards/access.guard';

@Module({
  imports: [
    FounderModule,
    MongooseModule.forFeature([
      { name: Startup.name, schema: StartupSchema }
    ]),
  ],
  controllers: [StartupsController],
  providers: [StartupsService],
  exports: [MongooseModule, StartupsService],
})
export class StartupsModule {}
