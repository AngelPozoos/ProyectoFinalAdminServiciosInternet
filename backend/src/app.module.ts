import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './transactional/mail.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { TransactionalModule } from './transactional/transactional.module';
import { LogisticsModule } from './logistics/logistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT || '2525', 10),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),CatalogModule, TransactionalModule, LogisticsModule, AuthModule],
  controllers: [AppController],
  exports: [MailService],
  providers: [MailService, AppService],
})
export class AppModule { }
