import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

export const mailConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get<string>("MAIL_HOST"),
    port: configService.get<number>("MAIL_PORT"),
    secure: true,
    auth: {
      user: configService.get<string>("MAIL_USER"),
      pass: configService.get<string>("MAIL_PASS"),
    },
  },
  defaults: {
    from: `"Vet Clinic" <${configService.get<string>("MAIL_FROM")}>`,
  },
  template: {
    dir: join(process.cwd(), "templates"),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
