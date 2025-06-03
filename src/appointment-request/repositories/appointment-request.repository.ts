import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { AppointmentRequest, AppointmentRequestStatus, Prisma } from "@prisma/client";

@Injectable()
export class AppointmentRequestRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async getById(appointmentRequestId: number): Promise<AppointmentRequest | null> {
    return await this.txHost.tx.appointmentRequest.findUnique({ where: { id: appointmentRequestId } });
  }

  public async getAll(): Promise<AppointmentRequest[]> {
    return await this.txHost.tx.appointmentRequest.findMany();
  }

  public async createAppointmentRequest(data: Prisma.AppointmentRequestCreateInput) {
    return await this.txHost.tx.appointmentRequest.create({
      data: {
        ...data,
        animals: {
          connect: data.animals?.connect ?? [],
        },
      },
    });
  }

  public async updateAppointmentStatus(appointmentId: number, status: AppointmentRequestStatus) {
    return await this.txHost.tx.appointmentRequest.update({ where: { id: appointmentId }, data: { status } });
  }

  public async assignDoctor(appointmentRequestId: number, doctorId: number): Promise<AppointmentRequest> {
    return await this.txHost.tx.appointmentRequest.update({
      where: { id: appointmentRequestId },
      data: {
        doctor: { connect: { id: doctorId } },
      },
    });
  }

  public async suggestTimeSlot(appointmentRequestId: number, timeSlotId: number): Promise<AppointmentRequest> {
    return await this.txHost.tx.appointmentRequest.update({
      where: { id: appointmentRequestId },
      data: {
        suggested_time_slot_id: timeSlotId,
        status: AppointmentRequestStatus.RESCHEDULED,
      },
    });
  }

  public async getPendingRequestsForDoctor(doctorId: number): Promise<AppointmentRequest[]> {
    return this.txHost.tx.appointmentRequest.findMany({
      where: { doctor_id: doctorId, status: AppointmentRequestStatus.PENDING },
    });
  }

  public async getRequestWithDetails(appointmentRequestId: number) {
    return this.txHost.tx.appointmentRequest.findUnique({
      where: { id: appointmentRequestId },
      include: {
        client: true,
        animals: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  public async approveAppointmentRequest(appointmentRequestId: number, timeSlotId: number) {
    return this.txHost.tx.appointmentRequest.update({
      where: { id: appointmentRequestId },
      data: { suggested_time_slot_id: timeSlotId, status: AppointmentRequestStatus.APPROVED },
      include: { animals: true },
    });
  }

  public async getRequestsByClientId(userId: number): Promise<AppointmentRequest[]> {
    return this.txHost.tx.appointmentRequest.findMany({ where: { client_id: userId } });
  }

  public async getAllRequestsPaginated(skip: number, take: number) {
    return this.txHost.tx.appointmentRequest.findMany({
      skip,
      take,
      orderBy: { created_at: "asc" },
      include: {
        client: true,
        doctor: {
          include: {
            user: true,
          },
        },
        time_slot: true,
        animals: true,
      },
    });
  }

  public async getRequestsByStatus(status: AppointmentRequestStatus): Promise<AppointmentRequest[]> {
    return this.txHost.tx.appointmentRequest.findMany({ where: { status } });
  }

  public async deleteExpiredRequests(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.txHost.tx.appointmentRequest.deleteMany({
      where: {
        status: { in: [AppointmentRequestStatus.PENDING, AppointmentRequestStatus.DECLINED] },
        created_at: { lt: date },
      },
    });
  }

  public async deleteById(id: number) {
    return this.txHost.tx.appointmentRequest.delete({ where: { id } });
  }
}
