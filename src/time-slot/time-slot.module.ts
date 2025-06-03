import { forwardRef, Module } from "@nestjs/common";
import { TimeSlotService } from "./time-slot.service";
import { TimeSlotController } from "./time-slot.controller";
import { TimeSlotRepository } from "./repositories/time-slot.repository";
import { AppointmentRequestModule } from "@/appointment-request/appointment-request.module";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [forwardRef(() => AppointmentRequestModule), UserModule],
  providers: [TimeSlotService, TimeSlotRepository],
  controllers: [TimeSlotController],
  exports: [TimeSlotService],
})
export class TimeSlotModule {}
