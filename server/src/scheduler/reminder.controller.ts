import { Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessGuard } from '../guards/access.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard, AccessGuard)
export class ReminderController {
    constructor(private readonly reminderService: ReminderService) {}

    @Get()
    getAllReminders(@Req() req, @Query('workspaceId') workspaceId?: string) {
        return this.reminderService.findAllByUser(req.user.userId, workspaceId);
    }

    @Patch(':id/complete')
    async markAsDone(@Param('id') id: string, @Req() req) {
        return this.reminderService.markReminderAndIntroCompleted(id, req.user.userId);
    }

    @Delete(':id')
    async deleteReminder(@Param('id') reminderId: string, @Req() req) {
        return this.reminderService.deleteReminder(reminderId, req.user.userId);
    }
}
