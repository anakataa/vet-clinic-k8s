import { IsEmail, IsNotEmpty } from "class-validator";

export class SendAccountConfirmationMailDto {
  @IsNotEmpty()
  confirmationLink: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userSurname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
