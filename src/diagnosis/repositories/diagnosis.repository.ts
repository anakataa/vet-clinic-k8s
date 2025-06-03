import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class DiagnosisRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  async create(data: Prisma.DiagnosisCreateInput) {
    return this.txHost.tx.diagnosis.create({ data });
  }

  async getById(id: number) {
    return this.txHost.tx.diagnosis.findUnique({ where: { id } });
  }

  async getAll() {
    return this.txHost.tx.diagnosis.findMany();
  }

  async getByAnimalId(animalId: number) {
    return this.txHost.tx.diagnosis.findMany({ where: { animal_id: animalId } });
  }

  async getByClientId(clientId: number) {
    return this.txHost.tx.diagnosis.findMany({ where: { client_id: clientId } });
  }

  async update(id: number, data: Prisma.DiagnosisUpdateInput) {
    return this.txHost.tx.diagnosis.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.txHost.tx.diagnosis.delete({ where: { id } });
  }
}
