import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";

export class requestResetPasswordDto {
  @ApiProperty({ example: "john.doe@example.com", description: "User's email" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
