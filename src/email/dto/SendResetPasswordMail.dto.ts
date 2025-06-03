import { IsEmail, IsNotEmpty } from "class-validator";

export class SendResetPasswordLinkDto {
  @IsNotEmpty()
  resetLink: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  userSurname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
