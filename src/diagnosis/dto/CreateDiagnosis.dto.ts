import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateDiagnosisDto {
  @ApiProperty({ example: 1, description: "Animal ID for which the diagnosis is made" })
  @IsInt()
  @IsNotEmpty()
  animalId: number;

  @ApiProperty({ example: 1, description: "Appointment ID linked to diagnosis" })
  @IsInt()
  @IsNotEmpty()
  appointmentId: number;

  @ApiProperty({ example: 1, description: "Client (user) ID who owns the animal" })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ example: "Severe allergic dermatitis", description: "Diagnosis description" })
  @IsString()
  @MinLength(10, { message: "Diagnosis description must be at least 10 characters long" })
  diagnosisDescription: string;

  @ApiProperty({ example: "Prescribed antihistamines and a special diet", description: "Treatment plan" })
  @IsString()
  @MinLength(5, { message: "Treatment must be at least 5 characters long" })
  treatment: string;
}
