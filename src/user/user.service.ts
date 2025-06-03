/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Role, User } from "@prisma/client";

import { UserRepository } from "./repositories/user.repository";
import { UserUpdateDto } from "./dto/UpdateUser.dto";
import { CreateDoctorDto } from "./dto/CreateDoctor.dto";
import { CreateAdministrationDto } from "@/user/dto/CreateAdministration.dto";
import { toCamelCaseUsers } from "./utils/toCamelCaseUsers";
import { toCamelCase } from "@/common/utils/toCamelCase";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.getByEmail(email);
  }

  public async getDetailedUserById(id: number): Promise<User | null> {
    return this.userRepository.getDetailedById(id);
  }

  public async createUser(
    userInfo: Omit<User, "id" | "phone_number" | "role" | "reset_password_token" | "reset_password_token_expires">,
  ): Promise<User> {
    return await this.userRepository.createUser(userInfo);
  }

  public async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return toCamelCaseUsers(users);
  }

  public async getDoctors() {
    const doctors = await this.userRepository.getDoctors();
    return toCamelCaseUsers(doctors);
  }

  public async getAdmins() {
    const admins = await this.userRepository.getAdmins();
    return toCamelCaseUsers(admins);
  }

  public async updateUser(id: number, updates: UserUpdateDto): Promise<User> {
    return await this.userRepository.updateUser(id, {
      user_name: updates.userName,
      user_surname: updates.userSurname,
      phone_number: updates.phoneNumber,
    });
  }

  public async updateFullUser(id: number, updates: Prisma.UserUpdateInput) {
    return await this.userRepository.updateUser(id, updates);
  }

  public async deleteUser(id: number): Promise<User> {
    return await this.userRepository.deleteUser(id);
  }

  public async getUserByConfirmationToken(token: string): Promise<User | null> {
    return this.userRepository.getUserByConfirmationToken(token);
  }

  public async getUserByResetPasswordToken(token: string): Promise<User | null> {
    return this.userRepository.getUserByResetPasswordToken(token);
  }

  public async createDoctorForUser(userId: number, { licenseNumber, specialization }: CreateDoctorDto): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException("User not found");

    return await this.userRepository.createDoctorForUser(userId, {
      specialization,
      license_number: licenseNumber,
    });
  }

  public async getDoctorById(doctorId: number) {
    const doctor = await this.userRepository.getDoctorById(doctorId);
    return toCamelCase(doctor) as unknown;
  }

  public async removeDoctorRights(userId: number): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException("User not found");

    if (user.role !== Role.DOCTOR) {
      throw new NotFoundException("User is not a doctor");
    }

    return await this.userRepository.removeDoctorFromUser(userId);
  }
  /*
  public async createAdministrationForUser(userId:number,{permissions}: CreateAdministrationDto){
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException("User not found");

    return await this.userRepository.createAdministrationForUser(userId, {
      permissions
    });
  }
  
*/
  async createAdministrator(userId: number, { permissions }: CreateAdministrationDto): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.userRepository.createAdministrationForUser(userId, {
      permissions,
    });
  }

  async removeAdminRights(userId: number): Promise<User> {
    const hasAdmin = await this.userRepository.hasAdminEntity(userId);
    if (!hasAdmin) {
      throw new NotFoundException("User is not an administrator");
    }

    return await this.userRepository.removeAdministrationFromUser(userId);
  }
}
