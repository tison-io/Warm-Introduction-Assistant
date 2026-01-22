import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorsService } from './investors.service';
import { InvestorsController } from './investors.controller';
import { Investor, InvestorSchema } from '../schemas/investor.schema';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { StartupsModule } from 'src/startups/startups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Investor.name, schema: InvestorSchema }]),
    WorkspaceModule,
    StartupsModule,
  ],
  controllers: [InvestorsController],
  providers: [InvestorsService],
  exports: [MongooseModule],
})
export class InvestorsModule {}