import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional } from "class-validator";

export class CreateTimeSlotDto {
  @ApiProperty({
    example: 1,
    description: "ID of the doctor creating the time slot",
  })
  @IsInt()
  doctorId: number;

  @ApiProperty({
    example: 5,
    description: "ID of the related appointment (if this slot is booked)",
  })
  @IsOptional()
  @IsInt()
  appointmentId?: number;

  @ApiProperty({
    example: 12,
    description: "ID of the appointment request this slot responds to (optional)",
  })
  @IsOptional()
  @IsInt()
  appointmentRequestId?: number;

  @ApiProperty({
    example: "2025-04-10T09:00:00.000Z",
    description: "Start date and time of the time slot (must be a future ISO 8601 date)",
  })
  @Type(() => Date)
  @IsDate()
  startAt: Date;

  @ApiProperty({
    example: "2025-04-10T09:30:00.000Z",
    description: "End date and time of the time slot (must be later than startAt)",
  })
  @Type(() => Date)
  @IsDate()
  endAt: Date;
}
