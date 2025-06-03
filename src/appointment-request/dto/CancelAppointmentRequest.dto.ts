import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CancelAppointmentRequestDto {
  @ApiProperty({ example: 1, description: "Id of appointment request" })
  @IsInt()
  appointmentRequestId: number;

  @ApiProperty({ example: 1, description: "Id of user, who want to cancel current request" })
  @IsInt()
  userId: number;
}
