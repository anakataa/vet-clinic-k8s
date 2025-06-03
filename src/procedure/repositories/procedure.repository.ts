import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProcedureRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async create(data: Prisma.ProcedureCreateInput) {
    return await this.txHost.tx.procedure.create({ data });
  }

  async getAll() {
    return await this.txHost.tx.procedure.findMany();
  }

  async getById(id: number) {
    return await this.txHost.tx.procedure.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.ProcedureUpdateInput) {
    return await this.txHost.tx.procedure.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await this.txHost.tx.procedure.delete({ where: { id } });
  }
}
