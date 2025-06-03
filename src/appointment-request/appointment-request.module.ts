import { forwardRef, Module } from "@nestjs/common";
import { AppointmentRequestService } from "./appointment-request.service";
import { AppointmentRequestController } from "./appointment-request.controller";
import { AuthModule } from "@/auth/auth.module";
import { UserModule } from "@/user/user.module";
import { AppointmentRequestRepository } from "./repositories/appointment-request.repository";
import { EmailModule } from "@/email/email.module";
import { TimeSlotModule } from "@/time-slot/time-slot.module";
import { AppointmentRequestTasks } from "./appointment-request-tasks";
import { AppointmentModule } from "@/appointment/appointment.module";

@Module({
  imports: [AuthModule, UserModule, EmailModule, forwardRef(() => TimeSlotModule), AppointmentModule],
  providers: [AppointmentRequestService, AppointmentRequestRepository, AppointmentRequestTasks],
  controllers: [AppointmentRequestController],
  exports: [AppointmentRequestService],
})
export class AppointmentRequestModule {}
