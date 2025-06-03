import { Module } from "@nestjs/common";
import { DiagnosisService } from "./diagnosis.service";
import { DiagnosisController } from "./diagnosis.controller";
import { DiagnosisRepository } from "./repositories/diagnosis.repository";

@Module({
  controllers: [DiagnosisController],
  providers: [DiagnosisService, DiagnosisRepository],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
