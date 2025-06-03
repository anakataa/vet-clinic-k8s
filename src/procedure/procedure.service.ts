import { Injectable, NotFoundException } from "@nestjs/common";
import { ProcedureRepository } from "./repositories/procedure.repository";
import { CreateProcedureDto } from "./dto/CreateProcedure.dto";
import { UpdateProcedureDto } from "./dto/UpdateProcedure.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProcedureService {
  constructor(private readonly procedureRepository: ProcedureRepository) {}

  async getProcedureById(id: number) {
    const procedure = await this.procedureRepository.getById(id);

    if (!procedure) {
      throw new NotFoundException("Procedure not found");
    }

    return procedure;
  }

  async getAllProcedures() {
    const procedures = await this.procedureRepository.getAll();

    return procedures.map((p) => ({
      id: p.id,
      procedureName: p.procedure_name,
      type: p.type,
      cost: Number(p.cost),
      description: p.description,
    }));
  }

  async createProcedure({ cost, procedureName, type, description }: CreateProcedureDto) {
    const procedure = await this.procedureRepository.create({
      cost: new Prisma.Decimal(cost),
      procedure_name: procedureName,
      type,
      description,
    });

    return {
      id: procedure.id,
      procedureName: procedure.procedure_name,
      type: procedure.type,
      cost: Number(procedure.cost),
      description: procedure.description,
    };
  }

  async updateProcedure(id: number, { cost, description, procedureName, type }: UpdateProcedureDto) {
    await this.getProcedureById(id);

    const procedure = await this.procedureRepository.update(id, {
      type,
      procedure_name: procedureName,
      cost: Number(cost),
      description,
    });

    return {
      id: procedure.id,
      type: procedure.type,
      procedureName: procedure.procedure_name,
      cost: Number(procedure.cost),
      description: procedure.description,
    };
  }

  async deleteProcedure(id: number) {
    await this.getProcedureById(id);

    return this.procedureRepository.delete(id);
  }
}
