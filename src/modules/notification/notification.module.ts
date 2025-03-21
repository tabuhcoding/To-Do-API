import { Module } from '@nestjs/common';
import { SetEmailNotifyController } from './commands/setEmailGetNotify/setEmailGetNotify.controller';
import { SetEmailNotifyService } from './commands/setEmailGetNotify/setEmailGetNotify.service';
import { EmailRepository } from './repositories/email.repositories';
import { SendEmailDailyService } from './commands/sendEmailDaily/sendEmailDaily.service';


@Module({
  controllers: [SetEmailNotifyController],
  providers: [SetEmailNotifyService,
    EmailRepository,
    SendEmailDailyService,
  ],
})
export class NotifyCationModule {}
