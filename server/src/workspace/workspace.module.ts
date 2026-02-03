import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspacesService } from './workspace.service';
import { WorkspacesController } from './workspace.controller';
import { Workspace, WorkspaceSchema } from './entities/workspace.entity';
import { Founder, FounderSchema } from '../founder/entities/founder.entity';
import { Invitation, InvitationSchema } from './entities/invitation.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: Founder.name, schema: FounderSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    MailModule,
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService, MongooseModule]
})
export class WorkspaceModule {}
