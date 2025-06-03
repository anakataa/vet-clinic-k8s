import { Injectable, NotFoundException } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { Prisma, Review } from "@prisma/client";

@Injectable()
export class ReviewRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async create(data: Prisma.ReviewCreateInput): Promise<Review> {
    return await this.txHost.tx.review.create({
      data,
    });
  }

  public async getAll(): Promise<Review[]> {
    return await this.txHost.tx.review.findMany({ include: { user: true } });
  }

  public async update(data: Prisma.ReviewUpdateInput, id: number): Promise<Review> {
    return await this.txHost.tx.review.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number): Promise<Review> {
    const existing = await this.txHost.tx.review.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Review with ID ${id} does not exist.`);
    }

    return this.txHost.tx.review.delete({ where: { id } });
  }

  public async getByUserId(id: number): Promise<Review | null> {
    return this.txHost.tx.review.findUnique({
      where: { user_id: id },
      include: { user: true },
    });
  }

  public async getById(id: number): Promise<Review | null> {
    return this.txHost.tx.review.findUnique({ where: { id }, include: { user: true } });
  }
}
