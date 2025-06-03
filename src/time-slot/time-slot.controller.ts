import { Roles } from "@/common/decorators/roles.decorator";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { TimeSlotService } from "./time-slot.service";
import { CreateTimeSlotDto } from "./dto/CreateTimeSlot.dto";
import { UpdateTimeSlotDto } from "./dto/UpdateTimeSlot.dto";

@ApiTags("Time slots")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard, RoleGuard)
@Controller("time-slot")
export class TimeSlotController {
  constructor(private readonly timeSlotService: TimeSlotService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Create a new time slot" })
  @ApiResponse({ status: 201, type: CreateTimeSlotDto })
  create(@Body() createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotService.createTimeSlot(createTimeSlotDto);
  }

  @Post("day")
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Create all time slots for woking day ()from 9am to 5pm" })
  @ApiResponse({ status: 201, type: CreateTimeSlotDto })
  createForDay(@Query("doctorId") doctorId: number, @Query("date") date: string) {
    return this.timeSlotService.createTimeSlotsForDay(doctorId, new Date(date));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get A time slot by ID" })
  @ApiResponse({ status: 200, type: Object })
  getById(@Param("id") id: number) {
    return this.timeSlotService.getTimeSlotById(id);
  }

  @Get(":id/detailed")
  @ApiOperation({ summary: "Get detailed time slot info" })
  getDetailedById(@Param("id") id: number) {
    return this.timeSlotService.getDetailedTimeSlotById(id);
  }

  @Patch()
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Update time slot info" })
  @ApiResponse({ status: 200, type: Object })
  update(@Body() updateTimeSlotDto: UpdateTimeSlotDto) {
    return this.timeSlotService.updateTimeSlotStatus(updateTimeSlotDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Delete a time slot by id" })
  @ApiResponse({ status: 204 })
  delete(@Param("id") id: number) {
    return this.timeSlotService.deleteTimeSlot(id);
  }

  @Get("doctor/:doctorId")
  @ApiOperation({ summary: "Get time slots for a doctor between 2 dates" })
  @ApiResponse({ status: 200, type: [Object] })
  getByDoctorAndPeriod(@Param("doctorId") doctorId: number, @Query("from") from: string, @Query("to") to: string) {
    return this.timeSlotService.getTimeSlotsByPeriod(doctorId, new Date(from), new Date(to));
  }
}
