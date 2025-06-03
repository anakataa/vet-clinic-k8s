import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class SuggestTimeSlotDto {
  @ApiProperty({ example: 1, description: "Id of appointment request" })
  @IsInt()
  appointmentRequestId: number;

  @ApiProperty({ example: 1, description: "proposed time slot id" })
  @IsInt()
  timeSlotId: number;

  @ApiProperty({ example: 1, description: "Doctor id" })
  @IsInt()
  doctorId: number;
}
