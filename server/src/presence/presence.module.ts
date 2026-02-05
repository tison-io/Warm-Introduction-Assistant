import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PresenceGateway } from './presence.gateway';
import { Founder, FounderSchema } from '../founder/entities/founder.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Founder.name, schema: FounderSchema }]),
  ],
  providers: [PresenceGateway],
})
export class PresenceModule {}