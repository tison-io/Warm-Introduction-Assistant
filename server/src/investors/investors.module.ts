import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorsService } from './investors.service';
import { InvestorsController } from './investors.controller';
import { Investor, InvestorSchema } from '../schemas/investor.schema';
import { StartupsModule } from 'src/startups/startups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Investor.name, schema: InvestorSchema }]),
    StartupsModule
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService],
})
export class InvestorsModule {}