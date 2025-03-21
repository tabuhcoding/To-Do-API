import { Module } from '@nestjs/common';
import { SetEmailNotifyController } from './commands/setEmailGetNotify/setEmailGetNotify.controller';
import { SetEmailNotifyService } from './commands/setEmailGetNotify/setEmailGetNotify.service';
import { EmailRepository } from './repositories/email.repositories';


@Module({
  controllers: [SetEmailNotifyController],
  providers: [SetEmailNotifyService,
    EmailRepository,
  ],
})
export class NotifyCationModule {}
