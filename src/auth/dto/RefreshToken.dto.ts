import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({
    example:
      "ecCI6IkIjoiam9obi5kb2JwaG9uZV9udW1iZXIiOm51bGwsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkaUNTT2lrSTVPd1hrNmxKRkpkanI2T1QySEZ3aHFkcWNsblRjdW5lT2JybDQ2S0FwZmZYbkMiLCJyb2xlIjoiVVNFUiIsImNyZWF0aW9uX2RhdGUiOiIQNl5tTYSVknI1Y",
    description: "refresh_token",
  })
  @IsString()
  @IsNotEmpty({ message: "refresh_token is required" })
  refresh_token: string;

  @ApiProperty({ example: "john.doe@example.com", description: "User's email" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;
}
