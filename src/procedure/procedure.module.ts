import { Module } from "@nestjs/common";
import { ProcedureController } from "./procedure.controller";
import { ProcedureService } from "./procedure.service";
import { ProcedureRepository } from "./repositories/procedure.repository";

@Module({
  controllers: [ProcedureController],
  providers: [ProcedureService, ProcedureRepository],
  exports: [ProcedureService],
})
export class ProcedureModule {}
