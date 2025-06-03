import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { UserUpdateDto } from "./dto/UpdateUser.dto";
import { GetUser } from "@/common/decorators/get-user.decorator";
import { Role, User } from "@prisma/client";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { CreateDoctorDto } from "./dto/CreateDoctor.dto";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CreateAdministrationDto } from "@/user/dto/CreateAdministration.dto";

@UseGuards(AuthGuard)
@ApiBearerAuth("access-token")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("update")
  @ApiOperation({ summary: "Update user profile", description: "Allows authenticated users to update their profile" })
  @ApiResponse({ status: 200, description: "User profile updated successfully" })
  @ApiResponse({ status: 400, description: "Validation failed" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateUser(@GetUser() user: User, @Body() updatedData: UserUpdateDto) {
    return this.userService.updateUser(user.id, updatedData);
  }

  @Post(":userId")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Assign doctor to existing user" })
  @ApiParam({ name: "userId", type: Number, example: 5 })
  @ApiResponse({ status: 201, description: "Doctor assigned to user" })
  async create(@Param("userId") userId: number, @Body() dto: CreateDoctorDto): Promise<User> {
    return this.userService.createDoctorForUser(userId, dto);
  }

  @Get(":userId/detailed")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Get detailed info about user" })
  @ApiParam({ name: "userId", type: Number, example: 1 })
  @ApiResponse({ status: 201 })
  async getDetailed(@Param("userId") userId: number) {
    return this.userService.getDetailedUserById(userId);
  }

  @Post(":userId/assign-admin")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Assign admin role to an existing user" })
  @ApiResponse({ status: 201, description: "Administrator role assigned" })
  async assignAdmin(@Param("userId") userId: number, @Body() dto: CreateAdministrationDto) {
    return this.userService.createAdministrator(userId, dto);
  }

  @Put(":userId/remove-admin")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Remove admin rights from a user" })
  @ApiResponse({ status: 200, description: "Admin rights removed" })
  async removeAdmin(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.removeAdminRights(userId);
  }

  @Get("all")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of all users" })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get("doctors")
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: "Get all doctors" })
  @ApiResponse({ status: 200, description: "List of all doctors" })
  async getAllDoctors() {
    return this.userService.getDoctors();
  }

  @Get("admins")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "List of all admins" })
  async getAllAdmins() {
    return this.userService.getAdmins();
  }

  @Get("by-email")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: "Get user by email" })
  @ApiResponse({ status: 200, description: "User found by email" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserByEmail(@Query("email") email: string): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }

  @Put(":userId/remove-doctor")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Remove doctor role from user" })
  @ApiResponse({ status: 200, description: "Doctor role removed" })
  async removeDoctor(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.removeDoctorRights(userId);
  }

  @Delete(":userId/delete")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete user" })
  @ApiResponse({ status: 200, description: "User deleted" })
  async deleteUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }
}
