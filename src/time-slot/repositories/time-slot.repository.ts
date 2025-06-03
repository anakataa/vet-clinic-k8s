import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";
import { Prisma, TimeSlot, TimeSlotStatus } from "@prisma/client";

@Injectable()
export class TimeSlotRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async getById(timeSlotId: number): Promise<TimeSlot | null> {
    return this.txHost.tx.timeSlot.findUnique({ where: { id: timeSlotId } });
  }

  public async getDetailedById(timeSlotId: number): Promise<TimeSlot | null> {
    return this.txHost.tx.timeSlot.findUnique({
      where: { id: timeSlotId },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        appointment: {
          include: {
            client: true,
            animals: true,
            doctor: true,
          },
        },
        appointmentRequest: {
          include: {
            animals: true,
            client: true,
            doctor: true,
          },
        },
      },
    });
  }

  public async createTimeSlot(data: Prisma.TimeSlotCreateInput): Promise<TimeSlot> {
    const { appointment, appointmentRequest, ...rest } = data;

    return this.txHost.tx.timeSlot.create({
      data: {
        ...rest,
        ...(appointment?.connect?.id && {
          appointment: { connect: { id: appointment.connect.id } },
        }),
        ...(appointmentRequest?.connect?.id && {
          appointmentRequest: { connect: { id: appointmentRequest.connect.id } },
        }),
        time_slot_status: TimeSlotStatus.BLOCKED,
        is_available: false,
      },
    });
  }

  public async updateTimeSlot(timeSlotId: number, data: Prisma.TimeSlotUpdateInput): Promise<TimeSlot> {
    return this.txHost.tx.timeSlot.update({ where: { id: timeSlotId }, data });
  }

  public async deleteTimeSlot(timeSlotId: number) {
    return this.txHost.tx.timeSlot.delete({ where: { id: timeSlotId } });
  }

  public async getAllUpcomingAvailableByDoctorId(doctorId: number): Promise<TimeSlot[]> {
    const now = new Date();

    return this.txHost.tx.timeSlot.findMany({
      where: {
        doctor_id: doctorId,
        is_available: true,
        time_slot_status: TimeSlotStatus.OPEN,
        start_at: {
          gt: now,
        },
      },
      orderBy: {
        start_at: "asc",
      },
    });
  }

  public async getAllUpcomingByDoctorId(doctorId: number): Promise<TimeSlot[]> {
    const now = new Date();

    return this.txHost.tx.timeSlot.findMany({
      where: {
        doctor_id: doctorId,
        start_at: {
          gt: now,
        },
      },
      orderBy: {
        start_at: "asc",
      },
    });
  }

  public async getOverlappingTimeSlot(doctorId: number, startAt: Date, endAt: Date, excludeId?: number) {
    const parsedStart = typeof startAt === "string" ? new Date(startAt) : startAt;
    const parsedEnd = typeof endAt === "string" ? new Date(endAt) : endAt;

    return this.txHost.tx.timeSlot.findFirst({
      where: {
        doctor_id: doctorId,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          {
            start_at: { lt: parsedEnd },
            end_at: { gt: parsedStart },
          },
        ],
      },
    });
  }

  public async getSlotsByDoctorAndPeriod(doctorId: number, from: Date, to: Date): Promise<TimeSlot[]> {
    return this.txHost.tx.timeSlot.findMany({
      where: {
        doctor_id: doctorId,
        start_at: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        start_at: "asc",
      },
    });
  }
}
