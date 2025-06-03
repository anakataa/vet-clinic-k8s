import { AppointmentRequestStatus, AppointmentStatus } from "@prisma/client";
import { IsNotEmpty, IsEmail, IsEnum } from "class-validator";

export class SendAppointmentRequestStatusUpdateDto {
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  appointmentStatus: AppointmentRequestStatus;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userSurname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
