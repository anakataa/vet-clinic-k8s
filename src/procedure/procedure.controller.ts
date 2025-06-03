import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ProcedureService } from "./procedure.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateProcedureDto } from "./dto/CreateProcedure.dto";
import { UpdateProcedureDto } from "./dto/UpdateProcedure.dto";

@ApiTags("Procedures")
@Controller("procedure")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  @ApiOperation({ summary: "Create a new procedure" })
  @ApiResponse({ status: 201, description: "Procedure successfully created." })
  @ApiResponse({ status: 403, description: "Forbidden. Only ADMINs can create procedures." })
  @ApiResponse({ status: 400, description: "Bad request. Validation failed." })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createProcedureDto: CreateProcedureDto) {
    return this.procedureService.createProcedure(createProcedureDto);
  }

  @Get("")
  @ApiOperation({ summary: "get All procedures" })
  @ApiResponse({ status: 200, description: "List of procedures." })
  async getAll() {
    return this.procedureService.getAllProcedures();
  }

  @Get(":id")
  @ApiOperation({ summary: "get One procedure" })
  @ApiResponse({ status: 200, description: "Procedure details." })
  @ApiResponse({ status: 404, description: "Procedure not found." })
  async getById(@Param("id", ParseIntPipe) id: number) {
    return this.procedureService.getProcedureById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a procedure" })
  @ApiResponse({ status: 200, description: "Procedure updated successfully." })
  @ApiResponse({ status: 404, description: "Procedure not found." })
  @ApiResponse({ status: 403, description: "Forbidden. Only ADMINs can update procedures." })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateProcedureDto: UpdateProcedureDto) {
    return this.procedureService.updateProcedure(id, updateProcedureDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a procedure" })
  @ApiResponse({ status: 200, description: "Procedure deleted successfully." })
  @ApiResponse({ status: 404, description: "Procedure not found." })
  @ApiResponse({ status: 403, description: "Forbidden. Only ADMINs can delete procedures." })
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.procedureService.deleteProcedure(id);
  }
}
