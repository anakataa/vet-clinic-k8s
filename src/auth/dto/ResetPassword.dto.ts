import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "secureNewPassword123",
    description: "New password for the user",
  })
  @IsNotEmpty({ message: "New password is required" })
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  newPassword: string;

  @ApiProperty({
    example: "secureNewPassword123",
    description: "Confirmation of the new password",
  })
  @IsNotEmpty({ message: "Password confirmation is required" })
  @IsString()
  newPasswordConfirmation: string;

  @ApiProperty({
    example: "8d3ef901-4f4d-4f61-b15b-4567e5c12345",
    description: "Reset password token sent via email",
  })
  @IsNotEmpty({ message: "Reset token is required" })
  @IsString()
  token: string;
}
