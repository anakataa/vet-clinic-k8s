import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional } from "class-validator";
import { AppointmentStatus } from "@prisma/client";

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ example: [1, 2], description: "Array of Animal IDs" })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  animalIds?: number[];

  @ApiPropertyOptional({ example: 1, description: "Procedure ID" })
  @IsOptional()
  @IsInt()
  procedureId?: number;

  @ApiPropertyOptional({ example: AppointmentStatus.COMPLETED, enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
