import { SendAppointmentRequestRescheduleDto } from "./dto/SendAppointmentRequestReschedule.dto";
import { SendAppointmentRequestStatusUpdateDto } from "./dto/SendAppointmentRequestStatusUpdate.dto";
import { SendResetPasswordLinkDto } from "./dto/SendResetPasswordMail.dto";
import { SendAccountConfirmationMailDto } from "./dto/SendAccountConfirmationMail.dto";
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAccountConfirmationMail({
    confirmationLink,
    email,
    userName,
    userSurname,
  }: SendAccountConfirmationMailDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Account Confirmation",
        template: "account-confirmation",
        context: {
          confirmationLink,
          userName,
          userSurname,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendResetPasswordMail({ email, resetLink, userName, userSurname }: SendResetPasswordLinkDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Reset Password",
        template: "reset-password",
        context: {
          resetLink,
          userName,
          userSurname,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendAppointmentRequestStatusUpdate({
    appointmentStatus,
    email,
    userName,
    userSurname,
  }: SendAppointmentRequestStatusUpdateDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Appointment request status update",
        template: "appointment-request-status-update",
        context: {
          appointmentStatus,
          userName,
          userSurname,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async sendAppointmentRequestReschedule({
    email,
    newTime,
    userName,
    userSurname,
  }: SendAppointmentRequestRescheduleDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Appointment request reschedule",
        template: "appointment-request-reschedule",
        context: {
          newTime,
          userName,
          userSurname,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
