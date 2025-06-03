import { ApiProperty } from "@nestjs/swagger";
import { Species } from "@prisma/client";
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateAppointmentRequestDto {
  @ApiProperty({ example: 1, description: "Id of client who requests an appointment" })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    example: [1, 2],
    description: "Array of animal ids the request is for. Can be empty or multiple",
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  animalIds?: number[];

  @ApiProperty({ example: 1, description: "Id of doctor", required: false })
  @IsOptional()
  @IsInt()
  doctorId?: number;

  @ApiProperty({
    example: "2025-03-30T20:44:50.071Z",
    description: "Preferred date/time for the appointment",
  })
  @IsDateString()
  preferredTime: Date;

  @ApiProperty({ description: "Reason for the visit", minLength: 10 })
  @IsString()
  @MinLength(10, { message: "Reason must be at least 10 characters long" })
  reason: string;

  @ApiProperty({
    example: ["DOG", "CAT"],
    description: "One or more species this request is for",
    required: false,
    isArray: true,
    enum: Species,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Species, { each: true })
  species?: Species[];
}
