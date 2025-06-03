import { Injectable, NotFoundException } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { AppointmentRepository } from "./repositories/appointment-repository";
import { CreateAppointmentDto } from "./dto/CreateAppointment.dto";
import { UpdateAppointmentDto } from "./dto/UpdateAppointment.dto";
import { toCamelCase } from "@/common/utils/toCamelCase";

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  @Transactional()
  async createAppointment({ animalIds, clientId, doctorId, timeSlotId, procedureId }: CreateAppointmentDto) {
    return this.appointmentRepository.createAppointment({
      client: { connect: { id: clientId } },
      doctor: { connect: { id: doctorId } },
      time_slot: { connect: { id: timeSlotId } },
      animals: animalIds?.length ? { connect: animalIds.map((id) => ({ id })) } : undefined,
      procedure: procedureId ? { connect: { id: procedureId } } : undefined,
    });
  }

  async getAppointmentById(id: number) {
    const appointment = await this.appointmentRepository.getById(id);
    if (!appointment) throw new NotFoundException("Appointment not found");
    return appointment;
  }

  async getAppointmentWithDetails(id: number) {
    const appointment = await this.appointmentRepository.getAppointmentWithDetails(id);
    console.log(appointment);
    return appointment ? ((toCamelCase([appointment]) as object[])[0] as unknown) : null;
  }

  async getAllAppointments() {
    const appointments = await this.appointmentRepository.getAll();
    return toCamelCase(appointments) as unknown;
  }

  async getAppointmentsByClientId(clientId: number) {
    const appointments = await this.appointmentRepository.getAppointmentsByClientId(clientId);
    return toCamelCase(appointments) as unknown;
  }

  async getAppointmentsByDoctorId(doctorId: number) {
    const appointments = await this.appointmentRepository.getAppointmentsByDoctorId(doctorId);
    return toCamelCase(appointments) as unknown;
  }

  async getAllAppointmentsPaginated(skip: number, take: number) {
    const appointments = await this.appointmentRepository.getAllAppointmentsPaginated(skip, take);
    return toCamelCase(appointments) as unknown;
  }

  @Transactional()
  async updateAppointment(id: number, data: UpdateAppointmentDto) {
    await this.getAppointmentById(id);
    const appointment = this.appointmentRepository.updateAppointment(id, {
      animals: data.animalIds ? { set: data.animalIds.map((id) => ({ id })) } : undefined,
      procedure: data.procedureId ? { connect: { id: data.procedureId } } : undefined,
      status: data.status,
    });
    return toCamelCase(appointment) as unknown;
  }

  @Transactional()
  async deleteAppointment(id: number) {
    await this.getAppointmentById(id);
    return this.appointmentRepository.deleteById(id);
  }
}
