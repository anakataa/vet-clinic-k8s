import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmAccountDto {
  @ApiProperty({
    example: "a7a41998-1fc1-4b13-a5aa-79c1f6f2188e",
    description: "Account confirmation token from email",
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
