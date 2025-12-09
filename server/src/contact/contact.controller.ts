import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMessage(@Body() contactDto: ContactDto) {
    const { name, email, message } = contactDto;
    await this.mailService.sendContactEmail(name, email, message);
    return { success: true, message: 'Message sent successfully!' };
  }
}
