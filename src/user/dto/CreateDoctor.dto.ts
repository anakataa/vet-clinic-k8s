import { ApiProperty } from "@nestjs/swagger";
import { VeterinarySpecialization } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class CreateDoctorDto {
  @ApiProperty({ example: VeterinarySpecialization.GENERAL, description: "Doctor specialization" })
  @IsEnum(VeterinarySpecialization)
  @IsString()
  specialization: VeterinarySpecialization;

  @ApiProperty({ example: "ABC12345", description: "Veterinary license number" })
  @IsString()
  licenseNumber: string;
}
