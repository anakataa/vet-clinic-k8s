import { ApproveAppointmentRequestDto } from "./dto/ApproveAppointmentRequest.dto";
import { Body, Controller, UseGuards, Post, Patch, Get, Param, Query, Delete } from "@nestjs/common";
import { AppointmentRequestService } from "./appointment-request.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { CreateAppointmentRequestDto } from "./dto/CreateAppointmentRequest.dto";
import { UpdateAppointmentStatusDto } from "./dto/UpdateAppointmentStatus.dto";
import { AssignDoctorDto } from "./dto/AssignDoctor.dto";
import { SuggestTimeSlotDto } from "./dto/SuggestTimeSlot.dto";
import { CancelAppointmentRequestDto } from "./dto/CancelAppointmentRequest.dto";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { AppointmentRequestStatus, Role } from "@prisma/client";

@ApiTags("appointment-requests")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@Controller("appointment-request")
export class AppointmentRequestController {
  constructor(private readonly appointmentRequestService: AppointmentRequestService) {}

  @Post("")
  @ApiOperation({ summary: "Create an appointment request" })
  @ApiResponse({ status: 201, description: "Created appointment request successfully" })
  create(@Body() createAppointmentRequestDto: CreateAppointmentRequestDto) {
    return this.appointmentRequestService.createAppointmentRequest(createAppointmentRequestDto);
  }

  @Patch("status")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Update appointment request status" })
  updateStatus(@Body() updateAppointmentRequestStatusDto: UpdateAppointmentStatusDto) {
    return this.appointmentRequestService.updateAppointmentStatus(updateAppointmentRequestStatusDto);
  }

  @Patch("assign-doctor")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Assign a doctor to an appointment request" })
  assignDoctor(@Body() assignDoctorDto: AssignDoctorDto) {
    return this.appointmentRequestService.takeAppointmentRequest(assignDoctorDto);
  }

  @Patch("suggest-slot")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Suggest time slot for an appointment request" })
  suggestTimeSlot(@Body() suggestTimeSlotDto: SuggestTimeSlotDto) {
    return this.appointmentRequestService.suggestTimeSlot(suggestTimeSlotDto);
  }

  @Patch("approve")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Approve an appointment request with selected time slot" })
  approve(@Body() approveAppointmentRequestDto: ApproveAppointmentRequestDto) {
    return this.appointmentRequestService.approveUserAppointmentRequest(approveAppointmentRequestDto);
  }

  @Patch("cancel")
  @ApiOperation({ summary: "Cancel a pending appointment request by client" })
  cancel(@Body() cancelAppointmentRequestDto: CancelAppointmentRequestDto) {
    return this.appointmentRequestService.cancelAppointmentRequest(cancelAppointmentRequestDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get appointment request information" })
  getById(@Param("id") id: number) {
    return this.appointmentRequestService.getAppointmentRequestById(id);
  }

  @Get(":id/details")
  @ApiOperation({ summary: "Get detailed information about an appointment" })
  getDetails(@Param("id") id: number) {
    return this.appointmentRequestService.getAppointmentRequestDetailedInformation(id);
  }

  @Get("client/:userId")
  @ApiOperation({ summary: "Get all appointments requests by user id" })
  getAllByClient(@Param("userId") userId: number) {
    return this.appointmentRequestService.getAllRequestsByClient(userId);
  }

  @Get("status/:status")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Get all appointment requests by status" })
  getByStatus(@Param("status") status: AppointmentRequestStatus) {
    return this.appointmentRequestService.getRequestsByStatus(status);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Get all requests with pagination" })
  getAll(@Query("skip") skip = 0, @Query("take") take = 10) {
    return this.appointmentRequestService.getAllRequests(skip, take);
  }

  @Delete(":appointmentRequestId")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiParam({ name: "appointmentRequestId", type: Number, example: 1 })
  @ApiResponse({ status: 204 })
  delete(@Param("appointmentRequestId") appointmentRequestId: number) {
    return this.appointmentRequestService.deleteAppointmentRequest(appointmentRequestId);
  }
}
