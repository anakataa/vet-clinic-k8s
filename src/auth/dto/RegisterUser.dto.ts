import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ example: "John", description: "User's first name" })
  @IsString()
  @IsNotEmpty({ message: "First name is required" })
  userName: string;

  @ApiProperty({ example: "Doe", description: "User's last name" })
  @IsString()
  @IsNotEmpty({ message: "Last name is required" })
  userSurname: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User's email", uniqueItems: true })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({ example: "securepassword123", description: "User's password", minLength: 6 })
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}
