import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TimeSlotStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsOptional, IsInt, IsBoolean, IsEnum, IsDate } from "class-validator";

export class UpdateTimeSlotDto {
  @ApiProperty({ example: 1, description: "Time slot id" })
  @IsInt()
  timeSlotId: number;

  @ApiPropertyOptional({ example: 5, description: "Appointment ID (optional)" })
  @IsOptional()
  @IsInt()
  appointmentId?: number;

  @ApiPropertyOptional({ example: 12, description: "Appointment request ID (optional)" })
  @IsOptional()
  @IsInt()
  appointmentRequestId?: number;

  @ApiPropertyOptional({ example: "2025-04-10T09:00:00.000Z", description: "Start time" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt?: Date;

  @ApiPropertyOptional({ example: "2025-04-10T09:30:00.000Z", description: "End time" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endAt?: Date;

  @ApiPropertyOptional({ example: "BOOKED", enum: TimeSlotStatus, description: "Status of the time slot" })
  @IsOptional()
  @IsEnum(TimeSlotStatus)
  timeSlotStatus?: TimeSlotStatus;

  @ApiPropertyOptional({ example: true, description: "Availability of the time slot" })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
