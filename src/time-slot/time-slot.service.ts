import { UserService } from "./../user/user.service";
import { TimeSlot } from "@prisma/client";
import { CreateTimeSlotDto } from "./dto/CreateTimeSlot.dto";
import { TimeSlotRepository } from "./repositories/time-slot.repository";
import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { AppointmentRequestService } from "@/appointment-request/appointment-request.service";
import { UpdateTimeSlotDto } from "./dto/UpdateTimeSlot.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { toCamelCase } from "@/common/utils/toCamelCase";

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AppointmentRequestService))
    private readonly appointmentRequestService: AppointmentRequestService,
  ) {}

  private async isOverlapping(doctorId: number, startAt: Date, endAt: Date): Promise<boolean> {
    const overlapping = await this.timeSlotRepository.getOverlappingTimeSlot(doctorId, startAt, endAt);
    return !!overlapping;
  }

  @Transactional()
  public async createTimeSlot({
    doctorId,
    endAt,
    startAt,
    appointmentId,
    appointmentRequestId,
  }: CreateTimeSlotDto): Promise<TimeSlot> {
    const doctor = await this.userService.getDoctorById(doctorId);

    if (!doctor) {
      throw new BadRequestException("Invalid doctor id");
    }

    const overlap = await this.isOverlapping(doctorId, startAt, endAt);

    if (overlap) {
      throw new ConflictException("Updated time slot overlaps with and existing one");
    }

    return await this.timeSlotRepository.createTimeSlot({
      doctor: { connect: { id: doctorId } },
      end_at: endAt,
      start_at: startAt,
      appointment: { connect: { id: appointmentId } },
      appointmentRequest: { connect: { id: appointmentRequestId } },
    });
  }

  @Transactional()
  public async createTimeSlotsForDay(doctorId: number, date: Date) {
    const slots: TimeSlot[] = [];

    // Define working hours: 9:00 AM to 5:00 PM
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0);

    let currentStart = new Date(dayStart);

    while (currentStart < dayEnd) {
      const currentEnd = new Date(currentStart);
      currentEnd.setHours(currentEnd.getHours() + 1); // 1-hour slot

      const overlap = await this.isOverlapping(doctorId, currentStart, currentEnd);

      if (overlap) {
        throw new ConflictException("Updated time slot overlaps with and existing one");
      }

      const slot = await this.timeSlotRepository.createTimeSlot({
        doctor: { connect: { id: doctorId } },
        start_at: currentStart,
        end_at: currentEnd,
      });

      slots.push(slot);
      currentStart = currentEnd;
    }

    return toCamelCase(slots) as unknown;
  }

  public async getTimeSlotById(timeSlotId: number) {
    return await this.timeSlotRepository.getById(timeSlotId);
  }

  public async getDetailedTimeSlotById(timeSlotId: number) {
    return await this.timeSlotRepository.getDetailedById(timeSlotId);
  }

  @Transactional()
  public async updateTimeSlotStatus({
    timeSlotId,
    appointmentId,
    appointmentRequestId,
    isAvailable,
    endAt,
    startAt,
    timeSlotStatus,
  }: UpdateTimeSlotDto) {
    const existing = await this.getTimeSlotById(timeSlotId);
    if (!existing) throw new BadRequestException("Time slot not found");

    const slot = this.timeSlotRepository.updateTimeSlot(timeSlotId, {
      ...(startAt && { start_at: startAt }),
      ...(endAt && { end_at: endAt }),
      ...(appointmentId && { appointment: { connect: { id: appointmentId } } }),
      ...(appointmentRequestId && { appointmentRequest: { connect: { id: appointmentRequestId } } }),
      ...(timeSlotStatus && { time_slot_status: timeSlotStatus }),
      ...(isAvailable !== undefined && { is_available: isAvailable }),
    });

    return toCamelCase(slot) as unknown;
  }

  public async deleteTimeSlot(timeSlotId: number) {
    await this.timeSlotRepository.deleteTimeSlot(timeSlotId);
  }

  public async getTimeSlotsByPeriod(doctorId: number, from: Date, to: Date) {
    const slots = await this.timeSlotRepository.getSlotsByDoctorAndPeriod(doctorId, from, to);

    return slots.map((slot) => ({
      id: slot.id,
      doctorId: slot.doctor_id,
      startAt: slot.start_at,
      endAt: slot.end_at,
      isAvailable: slot.is_available,
      timeSlotStatus: slot.time_slot_status,
    }));
  }
}
