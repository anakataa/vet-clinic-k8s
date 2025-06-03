import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
  @ApiProperty({ example: "John", description: "User first name", required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ example: "Doe", description: "User second name", required: false })
  @IsString()
  @IsOptional()
  userSurname?: string;

  @ApiProperty({ example: "+54253523532", description: "Telephone number", required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
