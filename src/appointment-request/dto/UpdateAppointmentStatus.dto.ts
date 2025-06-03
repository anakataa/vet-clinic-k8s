import { ApiProperty } from "@nestjs/swagger";
import { AppointmentRequestStatus } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class UpdateAppointmentStatusDto {
  @ApiProperty({ example: "1", description: "Appointment request id" })
  @IsNotEmpty()
  @IsInt()
  appointmentRequestId: number;

  @ApiProperty({ example: AppointmentRequestStatus.APPROVED, description: "New status for appointment" })
  @IsEnum(AppointmentRequestStatus)
  newStatus: AppointmentRequestStatus;
}
