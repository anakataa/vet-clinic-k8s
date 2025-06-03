import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppointmentRequestService } from "./appointment-request.service";

@Injectable()
export class AppointmentRequestTasks {
  constructor(private readonly appointmentRequestService: AppointmentRequestService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeleteExpiredRequests() {
    console.log("Running expired appointment requests clean up");
    await this.appointmentRequestService.deleteExpiredAppointmentRequests();
  }
}
