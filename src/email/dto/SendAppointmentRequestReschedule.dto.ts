import { IsNotEmpty, IsEmail, IsDateString } from "class-validator";

export class SendAppointmentRequestRescheduleDto {
  @IsNotEmpty()
  @IsDateString()
  newTime: Date;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userSurname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
