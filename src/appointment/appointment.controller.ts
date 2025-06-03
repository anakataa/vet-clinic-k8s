import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AppointmentService } from "./appointment.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateAppointmentDto } from "./dto/CreateAppointment.dto";
import { UpdateAppointmentDto } from "./dto/UpdateAppointment.dto";

@ApiTags("Appointments")
@Controller("appointment")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: "Create new appointment" })
  @ApiResponse({ status: 201, description: "Appointment created successfully" })
  @UseGuards(RoleGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(dto);
  }

  @Get("all")
  @ApiOperation({ summary: "Get all appointments" })
  async getAll() {
    return this.appointmentService.getAllAppointments();
  }

  @Get("paginated")
  @ApiOperation({ summary: "get paginated appointments" })
  @ApiQuery({ name: "skip", required: false, type: Number })
  @ApiQuery({ name: "take", required: false, type: Number })
  async getPaginated(@Query("skip") skip = 0, @Query("take") take = 10) {
    return this.appointmentService.getAllAppointmentsPaginated(skip, take);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get appointment by id" })
  @ApiParam({ name: "id", type: Number })
  async getById(@Param("id") id: number) {
    return this.appointmentService.getAppointmentById(id);
  }

  @Get(":id/details")
  @ApiOperation({ summary: "Get appointment with full details" })
  @ApiParam({ name: "id", type: Number })
  async getDetails(@Param("id") id: number) {
    return this.appointmentService.getAppointmentWithDetails(id);
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Get appointments for a specific client" })
  @ApiParam({ name: "clientId", type: Number })
  async getByClient(@Param("clientId") clientId: number) {
    return this.appointmentService.getAppointmentsByClientId(clientId);
  }

  @Get("doctor/:doctorId")
  @ApiOperation({ summary: "Get appointments for a specific doctor" })
  @ApiParam({ name: "doctorId", type: Number })
  async getByDoctor(@Param("doctorId") doctorId: number) {
    return this.appointmentService.getAppointmentsByDoctorId(doctorId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an appointment" })
  @ApiParam({ name: "id", type: Number })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  async update(@Param("id") id: number, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.updateAppointment(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an appointment" })
  @ApiParam({ name: "id", type: Number })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async delete(@Param("id") id: number) {
    return this.appointmentService.deleteAppointment(id);
  }
}
