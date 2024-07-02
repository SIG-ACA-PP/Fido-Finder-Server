import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'process';



@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: true,
        host: 'smtp.office365.com', //Outlook SMTP server
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS
        },
      },
      defaults: {
        from: 'Fido Finder Team <fidofinder@outlook.com>'
      }

    })
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
