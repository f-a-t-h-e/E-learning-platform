import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { templatesMap } from 'templates/template-map';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailVerification(
    params: Parameters<
      (typeof templatesMap)['email-verification']['textVersion']
    >[0],
    userEmail: string,
  ) {
    console.log(params);

    return await this.mailerService.sendMail({
      to: userEmail,
      from: this.configService.get('SMTP_ADMIN_EMAIL'),
      subject: 'E-Learning Platform | Verify Your Email',
      template: templatesMap['email-verification']['templateFile'],
      context: params,
      text: templatesMap['email-verification']['textVersion'](params),
    });
  }

  async sendForgotPasswordOtp(
    params: Parameters<
      (typeof templatesMap)['password-reset']['textVersion']
    >[0],
    userEmail: string,
  ) {
    console.log(params);

    return await this.mailerService.sendMail({
      to: userEmail,
      from: this.configService.get('SMTP_ADMIN_EMAIL'),
      subject: 'E-Learning Platform | Verify Your Email',
      template: templatesMap['password-reset']['templateFile'],
      context: params,
      text: templatesMap['password-reset']['textVersion'](params),
    });
  }
}
