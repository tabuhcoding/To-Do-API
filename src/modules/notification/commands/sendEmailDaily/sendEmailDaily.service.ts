import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailRepository } from '../../repositories/email.repositories';
import { EmailService } from 'src/infrastructure/adapters/email/email.service';

@Injectable()
export class SendEmailDailyService {
  private readonly logger = new Logger(SendEmailDailyService.name);

  constructor(
    private readonly emailRepository: EmailRepository,
    private readonly emailService: EmailService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_8AM)
  // @Cron('*/2 * * * *')
  @Cron('41 20 * * 5')
  async sendDailyTaskReminders() {
    this.logger.log('🔔 Running daily task reminder cron job...');

    const emails = await this.emailRepository.getEmails();
    if (emails.length === 0) {
      this.logger.warn('⚠ No registered emails found.');
      return;
    }

    const taskReminderEmails = await this.emailRepository.getTaskReminderEmails();
    if (taskReminderEmails.length === 0) {
      this.logger.warn('⚠ No tasks found for reminders.');
      return;
    }

    for (const mail of emails) {
      try {
        await this.emailService.sendTaskReminder(taskReminderEmails, mail.email);
        this.logger.log(`✅ Email sent to: ${mail.email}`);
      } catch (error) {
        this.logger.error(`❌ Failed to send email to ${mail.email}`, error);
      }
    }
  }
}
