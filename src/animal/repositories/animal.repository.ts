import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable } from "@nestjs/common";
import { Prisma, Animal, Species } from "@prisma/client";

@Injectable()
export class AnimalRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async getById(id: number): Promise<Animal | null> {
    return await this.txHost.tx.animal.findUnique({ where: { id }, include: { Diagnosis: true } });
  }

  public async getAll(): Promise<Animal[]> {
    return await this.txHost.tx.animal.findMany();
  }

  public async getByUserId(userId: number): Promise<Animal[]> {
    return await this.txHost.tx.animal.findMany({ where: { user_id: userId } });
  }

  public async createAnimal(data: Prisma.AnimalCreateInput): Promise<Animal> {
    return await this.txHost.tx.animal.create({ data });
  }

  public async updateAnimal(id: number, data: Prisma.AnimalUpdateInput): Promise<Animal> {
    return await this.txHost.tx.animal.update({
      where: { id },
      data,
    });
  }

  public async deleteAnimal(id: number): Promise<Animal> {
    return await this.txHost.tx.animal.delete({ where: { id } });
  }

  public async removeAnimalFromUserAndDelete(userId: number, animalId: number): Promise<Animal> {
    const animal = await this.txHost.tx.animal.findUnique({
      where: { id: animalId },
    });

    if (!animal || animal.user_id !== userId) {
      throw new Error("Animal does not belong to this user or does not exists");
    }

    return await this.txHost.tx.animal.delete({ where: { id: animalId } });
  }

  public async searchByAnimals(query: { name?: string; species?: string; breed?: string }): Promise<Animal[]> {
    return this.txHost.tx.animal.findMany({
      where: {
        ...(query.name && { name: { contains: query.name, mode: "insensitive" } }),
        ...(query.species && { species: query.species as Species }),
        ...(query.breed && { name: { contains: query.breed, mode: "insensitive" } }),
      },
    });
  }
}
