import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'common/services/otp.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          type: 'single',
        };
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') == 'development') {
          return {
            transport: {
              host: 'localhost',
              port: 1025,
              ignoreTLS: true,
              secure: false,
              auth: {
                user: process.env.MAILDEV_INCOMING_USER,
                pass: process.env.MAILDEV_INCOMING_PASS,
              },
            },
            defaults: {
              from: '"No Reply" <no-reply@localhost>',
            },
            /**
             * This will save the files in /temp dir on the os (default)
             */
            preview: {
              open: true,
              dir: join(process.cwd(), 'tmp'),
            },
            template: {
              dir: join(process.cwd(), 'templates'),
              adapter: new EjsAdapter(),
              options: {
                strict: true,
              },
            },
          };
        }
        return {
          transport: {
            host: configService.get('SMTP_HOST'),
            auth: {
              user: configService.get('SMTP_USERNAME'),
              pass: configService.get('SMTP_PASSWORD'),
            },
            port: configService.get<number>('SMTP_PORT'),
            // tls: configService.get<'yes'>('SMTP_TLS'),
            service: configService.get('SMTP_SERVICE'),
          },
          defaults: {
            from: configService.get('SMTP_DEFAULT_SENDER'),
          },
          template: {
            dir: join(process.cwd(), 'templates'),
            adapter: new EjsAdapter(),
            options: {
              /**
               * This requires using `locals.<variable-name> for accessing the variables passed to `context` field
               */
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [MailingController],
  providers: [OtpService, MailingService],
})
export class MailingModule {}
