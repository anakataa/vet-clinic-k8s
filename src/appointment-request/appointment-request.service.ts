import { UserService } from "@/user/user.service";
import { CreateAppointmentRequestDto } from "./dto/CreateAppointmentRequest.dto";
import { AppointmentRequestRepository } from "./repositories/appointment-request.repository";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EmailService } from "@/email/email.service";
import { AppointmentRequest, AppointmentRequestStatus, TimeSlotStatus } from "@prisma/client";
import { UpdateAppointmentStatusDto } from "./dto/UpdateAppointmentStatus.dto";
import { AssignDoctorDto } from "./dto/AssignDoctor.dto";
import { SuggestTimeSlotDto } from "./dto/SuggestTimeSlot.dto";
import { TimeSlotService } from "@/time-slot/time-slot.service";
import { Transactional } from "@nestjs-cls/transactional";
import { ApproveAppointmentRequestDto } from "./dto/ApproveAppointmentRequest.dto";
import { CancelAppointmentRequestDto } from "./dto/CancelAppointmentRequest.dto";
import { AppointmentService } from "@/appointment/appointment.service";
import { toCamelCase } from "@/common/utils/toCamelCase";

@Injectable()
export class AppointmentRequestService {
  constructor(
    private readonly appointmentRequestRepository: AppointmentRequestRepository,
    private readonly userService: UserService,
    private readonly timeSlotService: TimeSlotService,
    private readonly emailService: EmailService,
    private readonly appointmentService: AppointmentService,
  ) {}

  @Transactional()
  public async createAppointmentRequest({
    clientId,
    preferredTime,
    reason,
    animalIds,
    doctorId,
    species,
  }: CreateAppointmentRequestDto) {
    if (new Date() > new Date(preferredTime)) {
      throw new BadRequestException("Appointment preferred time should be in future");
    }

    const user = await this.userService.getUserById(clientId);

    if (!user) {
      throw new NotFoundException("Invalid user id");
    }

    if (doctorId) {
      const doctor = await this.userService.getDoctorById(doctorId);

      if (!doctor) {
        throw new NotFoundException("Invalid doctor id");
      }
    }

    const appointmentRequest = await this.appointmentRequestRepository.createAppointmentRequest({
      client: { connect: { id: user.id } },
      preferred_time: preferredTime,
      species,
      reason,
      ...(animalIds && {
        animals: {
          connect: animalIds.map((id) => ({ id })),
        },
      }),
      ...(doctorId && { doctor: { connect: { id: doctorId } } }),
    });

    await this.emailService.sendAppointmentRequestStatusUpdate({
      appointmentStatus: appointmentRequest.status,
      email: user.email,
      userName: user.user_name,
      userSurname: user.user_name,
    });

    return toCamelCase(appointmentRequest) as unknown;
  }

  @Transactional()
  public async updateAppointmentStatus({
    appointmentRequestId,
    newStatus,
  }: UpdateAppointmentStatusDto): Promise<AppointmentRequest> {
    const appointmentRequest = await this.appointmentRequestRepository.getById(appointmentRequestId);

    if (!appointmentRequest) {
      throw new BadRequestException("Invalid appointment request ID");
    }

    const user = await this.userService.getUserById(appointmentRequest.client_id);

    const updatedAppointmentRequest = await this.appointmentRequestRepository.updateAppointmentStatus(
      appointmentRequestId,
      newStatus,
    );
    await this.emailService.sendAppointmentRequestStatusUpdate({
      appointmentStatus: updatedAppointmentRequest.status,
      email: user.email,
      userName: user.user_name,
      userSurname: user.user_surname,
    });

    return updatedAppointmentRequest;
  }

  @Transactional()
  public async takeAppointmentRequest({
    appointmentRequestId,
    doctorId,
  }: AssignDoctorDto): Promise<AppointmentRequest> {
    return await this.appointmentRequestRepository.assignDoctor(appointmentRequestId, doctorId);
  }

  @Transactional()
  public async suggestTimeSlot({ appointmentRequestId, timeSlotId, doctorId }: SuggestTimeSlotDto) {
    const doctor = await this.userService.getDoctorById(doctorId);

    if (!doctor) {
      throw new BadRequestException("Invalid doctor id");
    }

    const appointmentRequest = await this.appointmentRequestRepository.getById(appointmentRequestId);

    if (!appointmentRequest) {
      throw new BadRequestException("Invalid appointment request id");
    }

    const timeSlot = await this.timeSlotService.getTimeSlotById(timeSlotId);

    if (!timeSlot) {
      throw new BadRequestException("Invalid time Slot id");
    }

    if (!timeSlot.is_available || timeSlot.time_slot_status !== TimeSlotStatus.OPEN) {
      throw new ConflictException("Time slot already taken or unavailable");
    }

    await this.timeSlotService.updateTimeSlotStatus({
      timeSlotId: timeSlot.id,
      timeSlotStatus: TimeSlotStatus.BOOKED,
    });

    const user = await this.userService.getUserById(appointmentRequest.client_id);

    if (!user) {
      throw new BadRequestException("Invalid user");
    }

    const updatedAppointmentRequest = await this.appointmentRequestRepository.suggestTimeSlot(
      appointmentRequest.id,
      timeSlot.id,
    );

    await this.emailService.sendAppointmentRequestReschedule({
      email: user.email,
      newTime: timeSlot.start_at,
      userName: user.user_name,
      userSurname: user.user_surname,
    });

    return toCamelCase(updatedAppointmentRequest) as unknown;
  }

  @Transactional()
  public async getAppointmentRequestById(appointmentRequestId: number) {
    return this.appointmentRequestRepository.getById(appointmentRequestId);
  }

  @Transactional()
  public async approveUserAppointmentRequest({ appointmentRequestId, timeSlotId }: ApproveAppointmentRequestDto) {
    const timeSlot = await this.timeSlotService.getTimeSlotById(timeSlotId);

    if (!timeSlot) {
      throw new BadRequestException("Invalid time Slot id");
    }

    if (
      !timeSlot.is_available ||
      (timeSlot.time_slot_status !== TimeSlotStatus.OPEN && timeSlot.time_slot_status !== TimeSlotStatus.BOOKED)
    ) {
      throw new ConflictException("Time slot already taken or unavailable");
    }

    await this.timeSlotService.updateTimeSlotStatus({
      timeSlotId: timeSlot.id,
      timeSlotStatus: TimeSlotStatus.BLOCKED,
      isAvailable: false,
    });

    const approvedAppointmentRequest = await this.appointmentRequestRepository.approveAppointmentRequest(
      appointmentRequestId,
      timeSlotId,
    );

    const user = await this.userService.getUserById(approvedAppointmentRequest.client_id);

    if (!user) {
      throw new BadRequestException("Invalid user id");
    }

    const appointment = await this.appointmentService.createAppointment({
      clientId: approvedAppointmentRequest.client_id,
      doctorId: approvedAppointmentRequest.doctor_id!,
      timeSlotId: timeSlotId,
      animalIds: approvedAppointmentRequest.animals.map(({ id }) => id),
    });

    if (!appointment) {
      throw new BadRequestException("Can not create appointment");
    }

    await this.emailService.sendAppointmentRequestStatusUpdate({
      appointmentStatus: approvedAppointmentRequest.status,
      email: user.email,
      userName: user.user_name,
      userSurname: user.user_surname,
    });

    return toCamelCase(approvedAppointmentRequest) as unknown;
  }

  public async getAppointmentRequestDetailedInformation(appointmentRequestId: number) {
    return this.appointmentRequestRepository.getRequestWithDetails(appointmentRequestId);
  }

  @Transactional()
  public async cancelAppointmentRequest({ appointmentRequestId, userId }: CancelAppointmentRequestDto) {
    const request = await this.appointmentRequestRepository.getById(appointmentRequestId);

    if (!request || request.client_id !== userId) {
      throw new BadRequestException("Invalid request or access denied");
    }

    if (request.status !== AppointmentRequestStatus.PENDING) {
      throw new BadRequestException("Only pending request can be cancelled");
    }

    const client = await this.userService.getUserById(userId);

    await this.emailService.sendAppointmentRequestStatusUpdate({
      appointmentStatus: AppointmentRequestStatus.DECLINED,
      email: client.email,
      userName: client.user_name,
      userSurname: client.user_surname,
    });

    return this.appointmentRequestRepository.updateAppointmentStatus(
      appointmentRequestId,
      AppointmentRequestStatus.DECLINED,
    );
  }

  public async getAllRequestsByClient(userId: number) {
    const requests = await this.appointmentRequestRepository.getRequestsByClientId(userId);
    return toCamelCase(requests) as unknown;
  }

  public async getRequestsByStatus(status: AppointmentRequestStatus) {
    const requests = await this.appointmentRequestRepository.getRequestsByStatus(status);
    return toCamelCase(requests) as unknown;
  }

  public async getAllRequests(skip: number, take: number) {
    const requests = await this.appointmentRequestRepository.getAllRequestsPaginated(skip, take);
    return toCamelCase(requests) as unknown;
  }

  @Transactional()
  public async deleteExpiredAppointmentRequests() {
    return this.appointmentRequestRepository.deleteExpiredRequests();
  }

  @Transactional()
  public async deleteAppointmentRequest(appointmentRequestId: number) {
    return this.appointmentRequestRepository.deleteById(appointmentRequestId);
  }
}
