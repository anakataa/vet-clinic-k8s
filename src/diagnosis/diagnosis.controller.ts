import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { DiagnosisService } from "./diagnosis.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateDiagnosisDto } from "./dto/CreateDiagnosis.dto";
import { UpdateDiagnosisDto } from "./dto/UpdatedDiagnosis.dto";

@ApiTags("Diagnoses")
@Controller("diagnosis")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post()
  @ApiOperation({ summary: "Create a new diagnosis" })
  @ApiResponse({ status: 201, description: "Diagnosis successfully created." })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  async create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    return this.diagnosisService.createDiagnosis(createDiagnosisDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all diagnoses" })
  @ApiResponse({ status: 200, description: "List of diagnoses." })
  async getAll() {
    return this.diagnosisService.getAllDiagnoses();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a diagnosis by ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Diagnosis details." })
  @ApiResponse({ status: 404, description: "Diagnosis not found." })
  async getById(@Param("id", ParseIntPipe) id: number) {
    return this.diagnosisService.getDiagnosisById(id);
  }

  @Get("animal/:animalId")
  @ApiOperation({ summary: "Get all diagnoses for a specific animal" })
  @ApiParam({ name: "animalId", type: Number })
  async getByAnimal(@Param("animalId", ParseIntPipe) animalId: number) {
    return this.diagnosisService.getDiagnosesByAnimal(animalId);
  }

  @Get("client/:clientId")
  @ApiOperation({ summary: "Get all diagnoses for a specific client" })
  @ApiParam({ name: "clientId", type: Number })
  async getByClient(@Param("clientId", ParseIntPipe) clientId: number) {
    return this.diagnosisService.getDiagnosesByClient(clientId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a diagnosis" })
  @ApiParam({ name: "id", type: Number })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateDiagnosisDto: UpdateDiagnosisDto) {
    return this.diagnosisService.updateDiagnosis(id, updateDiagnosisDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a diagnosis" })
  @ApiParam({ name: "id", type: Number })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.diagnosisService.deleteDiagnosis(id);
  }
}
