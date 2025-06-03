import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Animal, Doctor, Permissions, Prisma, Role, User } from "@prisma/client";

export type DetailedUser = Prisma.UserGetPayload<{
  include: {
    animals: true;
    doctor: true;
    admin: true;
    appointments: {
      include: {
        animal: true;
        doctor: {
          include: {
            user: true;
          };
        };
      };
    };
    appointmentRequests: {
      include: {
        doctor: true;
        animal: true;
      };
    };
  };
}>;

@Injectable()
export class UserRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  public async getById(id: number): Promise<User | null> {
    return await this.txHost.tx.user.findUnique({ where: { id } });
  }

  public async getByEmail(email: string): Promise<User | null> {
    return this.txHost.tx.user.findUnique({
      where: { email },
      include: {
        animals: true,
        doctor: true,
        admin: true,
      },
    });
  }

  public async getDetailedById(id: number) {
    return this.txHost.tx.user.findUnique({
      where: { id },
      include: {
        animals: true,
        doctor: true,
        admin: true,
        appointments: {
          include: {
            client: true,
            animals: true,
            doctor: {
              include: {
                user: true,
              },
            },
            time_slot: true,
            diagnosis: true,
          },
        },
        appointmentRequests: {
          include: {
            doctor: true,
            animals: true,
          },
        },
      },
    });
  }

  public async getAllUsers(): Promise<Partial<User>[]> {
    return await this.txHost.tx.user.findMany({
      select: {
        id: true,
        user_name: true,
        user_surname: true,
        email: true,
        phone_number: true,
        role: true,
        creation_date: true,
      },
    });
  }

  public async getDoctors(): Promise<User[]> {
    return await this.txHost.tx.user.findMany({
      where: { role: Role.DOCTOR },
      include: {
        doctor: true,
      },
    });
  }

  public async getAdmins(): Promise<Partial<User>[]> {
    return await this.txHost.tx.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        user_name: true,
        user_surname: true,
        email: true,
        phone_number: true,
        role: true,
        creation_date: true,
      },
    });
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.txHost.tx.user.create({ data });
  }

  public async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.txHost.tx.user.update({
      where: { id },
      data,
    });
  }

  public async deleteUser(id: number): Promise<User> {
    return await this.txHost.tx.user.delete({ where: { id } });
  }

  public async getUserWithAnimals(id: number): Promise<User | null> {
    return await this.txHost.tx.user.findUnique({
      where: { id },
      include: { animals: true },
    });
  }

  public async addAnimalToUser(userId: number, animalData: Prisma.AnimalCreateWithoutUserInput): Promise<Animal> {
    return await this.txHost.tx.animal.create({
      data: {
        ...animalData,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  public async getUserByConfirmationToken(token: string): Promise<User | null> {
    return this.txHost.tx.user.findFirst({
      where: {
        confirmation_token: token,
        confirmation_token_expires: {
          gt: new Date(),
        },
      },
    });
  }

  public async getUserByResetPasswordToken(token: string): Promise<User | null> {
    return this.txHost.tx.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_token_expires: {
          gt: new Date(),
        },
      },
    });
  }

  public async getDoctorById(doctorId: number): Promise<Doctor> {
    const doctor = await this.txHost.tx.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }
    return doctor;
  }

  public async getUsersByRole(role: Role): Promise<User[]> {
    return this.txHost.tx.user.findMany({
      where: { role },
    });
  }

  public async createDoctorForUser(userId: number, data: Prisma.DoctorCreateWithoutUserInput): Promise<User> {
    await this.txHost.tx.doctor.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
    await this.txHost.tx.user.update({
      where: { id: userId },
      data: { role: Role.DOCTOR },
    });

    return this.getById(userId) as Promise<User>;
  }
  async createAdministrationForUser(userId: number, data: { permissions: Permissions }): Promise<User> {
    return this.txHost.tx.user.update({
      where: { id: userId },
      data: {
        role: Role.ADMIN,
        admin: {
          create: {
            permissions: data.permissions,
          },
        },
      },
      include: { admin: true },
    });
  }

  async removeAdministrationFromUser(userId: number): Promise<User> {
    return this.txHost.tx.user.update({
      where: { id: userId },
      data: {
        role: Role.USER,
        admin: {
          delete: true,
        },
      },
      include: { admin: true },
    });
  }

  async hasAdminEntity(userId: number): Promise<boolean> {
    const admin = await this.txHost.tx.administration.findUnique({
      where: { user_id: userId },
    });
    return !!admin;
  }

  async removeDoctorFromUser(userId: number): Promise<User> {
    await this.txHost.tx.doctor.delete({
      where: { user_id: userId },
    });

    return this.txHost.tx.user.update({
      where: { id: userId },
      data: {
        role: Role.USER,
      },
    });
  }
}
