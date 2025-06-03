import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class AssignDoctorDto {
  @ApiProperty({ example: 1, description: "Appointment request id" })
  @IsInt()
  appointmentRequestId: number;

  @ApiProperty({ example: 1, description: "Doctor id" })
  @IsInt()
  doctorId: number;
}
