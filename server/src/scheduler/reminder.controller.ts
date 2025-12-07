import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
