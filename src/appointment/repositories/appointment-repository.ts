import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { Appointment, Prisma } from "@prisma/client";

@Injectable()
export class AppointmentRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async getById(appointmentId: number): Promise<Appointment | null> {
    return await this.txHost.tx.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        doctor: { include: { user: true } },
        animals: true,
        time_slot: true,
        diagnosis: true,
      },
    });
  }

  public async getAll(): Promise<Appointment[]> {
    return await this.txHost.tx.appointment.findMany({
      include: { client: true, doctor: true, time_slot: true, animals: true, diagnosis: true },
    });
  }

  public async createAppointment(data: Prisma.AppointmentCreateInput) {
    return await this.txHost.tx.appointment.create({
      data: {
        ...data,
        animals: {
          connect: data.animals?.connect ?? [],
        },
      },
    });
  }

  public async getAppointmentWithDetails(id: number) {
    return this.txHost.tx.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        animals: true,
        time_slot: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  public async getAppointmentsByClientId(client_id: number): Promise<Appointment[]> {
    return this.txHost.tx.appointment.findMany({ where: { client_id } });
  }

  public async getAllAppointmentsPaginated(skip: number, take: number) {
    return this.txHost.tx.appointment.findMany({
      skip,
      take,
      orderBy: { created_at: "asc" },
    });
  }

  public async deleteById(id: number) {
    return this.txHost.tx.appointment.delete({ where: { id } });
  }

  public async updateAppointment(id: number, data: Prisma.AppointmentUpdateInput) {
    return this.txHost.tx.appointment.update({ where: { id }, data });
  }

  public async getAppointmentsByDoctorId(id: number) {
    return this.txHost.tx.appointment.findMany({
      where: { doctor_id: id },
      include: { client: true, doctor: true, time_slot: true, animals: true, diagnosis: true },
    });
  }

  public async getUpcomingAppointmentsForDoctor(doctorId: number): Promise<Appointment[]> {
    const now = new Date();
    return this.txHost.tx.appointment.findMany({
      where: {
        doctor_id: doctorId,
        time_slot: {
          start_at: { gte: now },
        },
      },
      orderBy: {
        time_slot: { start_at: "asc" },
      },
      include: {
        client: true,
        animals: true,
        time_slot: true,
      },
    });
  }
}
