import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: "Client ID" })
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({ example: 1, description: "Doctor ID" })
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @ApiProperty({ example: 1, description: "Time Slot ID" })
  @IsInt()
  @IsNotEmpty()
  timeSlotId: number;

  @ApiProperty({ example: [1, 2], description: "Array of Animal IDs" })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  animalIds?: number[];

  @ApiProperty({ example: 1, description: "Procedure ID", required: false })
  @IsOptional()
  @IsInt()
  procedureId?: number;
}
