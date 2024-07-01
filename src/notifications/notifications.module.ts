import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailerModule } from '@nestjs-modules/mailer';



@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: true,
        host: 'smtp.office365.com', //Outlook SMTP server
        port: 587,
        secure: false,
        auth: {
          user: 'fidofinder@outlook.com',
          pass: 'M3smer753357',
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
