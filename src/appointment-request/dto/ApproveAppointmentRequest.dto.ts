import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class ApproveAppointmentRequestDto {
  @ApiProperty({ example: 1, description: "Id of appointment request" })
  @IsInt()
  appointmentRequestId: number;

  @ApiProperty({ example: 1, description: "Approved time slot id" })
  @IsInt()
  timeSlotId: number;
}
