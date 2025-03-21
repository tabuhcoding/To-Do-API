import { Controller, Put, Param, Body, HttpStatus, Res, Injectable } from '@nestjs/common';
import { EmailRepository } from '../../repositories/email.repositories';
import { EmailService } from 'src/infrastructure/adapters/email/email.service';

@Injectable()
export class SetEmailNotifyService {
  constructor(private readonly emailRepository: EmailRepository,
    private readonly emailService: EmailService,
  ) {}

  async setEmailNotify(email: string) {
    try {
      const createdEmail = await this.emailRepository.setEmail(email);
      if (!createdEmail) {
        return null;
      }
      const emails = await this.emailRepository.getEmails();
      if (emails.length > 0) {
        const taskReminderEmails = await this.emailRepository.getTaskReminderEmails();
        // console.log(taskReminderEmails);
        if (taskReminderEmails.length > 0) {
          for (const mail of emails) {
            await this.emailService.sendTaskReminder(taskReminderEmails, mail.email);
          }
        }
      }
      return createdEmail;
    } catch (error) {
      return null;
    }
  }
}
