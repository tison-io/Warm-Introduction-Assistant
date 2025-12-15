import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class ReminderController {
    constructor(private readonly reminderService: ReminderService) {}

    @Get()
    getAllReminders(@Req() req) {
        const founderId = req.user.userId;
        return this.reminderService.findAllByUser(founderId);
    }

    @Patch(':id/complete')
    async markAsDone(@Param('id') id: string, @Req() req) {
        const founderId = req.user.userId;
        return this.reminderService.markReminderAndIntroCompleted(id, founderId);
    }

    @Delete(':id')
    async deleteReminder(@Param('id') reminderId: string, @Req() req) {
        const founderId = req.user.userId;
        await this.reminderService.deleteReminder(reminderId, founderId);
    }
}
