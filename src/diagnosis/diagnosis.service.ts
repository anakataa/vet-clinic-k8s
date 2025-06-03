import { Injectable, NotFoundException } from "@nestjs/common";
import { DiagnosisRepository } from "./repositories/diagnosis.repository";
import { CreateDiagnosisDto } from "./dto/CreateDiagnosis.dto";
import { UpdateDiagnosisDto } from "./dto/UpdatedDiagnosis.dto";

@Injectable()
export class DiagnosisService {
  constructor(private readonly diagnosisRepository: DiagnosisRepository) {}

  async getDiagnosisById(id: number) {
    const diagnosis = await this.diagnosisRepository.getById(id);

    if (!diagnosis) {
      throw new NotFoundException("Diagnosis not found");
    }

    return diagnosis;
  }

  async getAllDiagnoses() {
    return this.diagnosisRepository.getAll();
  }

  async getDiagnosesByAnimal(animalId: number) {
    return this.diagnosisRepository.getByAnimalId(animalId);
  }

  async getDiagnosesByClient(clientId: number) {
    return this.diagnosisRepository.getByClientId(clientId);
  }

  async createDiagnosis({ animalId, appointmentId, clientId, diagnosisDescription, treatment }: CreateDiagnosisDto) {
    return this.diagnosisRepository.create({
      diagnosis_description: diagnosisDescription,
      treatment: treatment,
      animal: { connect: { id: animalId } },
      appointment: { connect: { id: appointmentId } },
      client: { connect: { id: clientId } },
    });
  }

  async updateDiagnosis(id: number, { diagnosisDescription, treatment }: UpdateDiagnosisDto) {
    await this.getDiagnosisById(id);

    return this.diagnosisRepository.update(id, {
      diagnosis_description: diagnosisDescription,
      treatment: treatment,
    });
  }

  async deleteDiagnosis(id: number) {
    await this.getDiagnosisById(id);

    return this.diagnosisRepository.delete(id);
  }
}
