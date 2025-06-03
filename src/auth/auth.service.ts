import { UserService } from "@/user/user.service";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "./dto/RegisterUser.dto";
import { LoginDto } from "./dto/Login.dto";
import { RefreshTokenDto } from "./dto/RefreshToken.dto";
import { randomUUID } from "crypto";
import { Transactional } from "@nestjs-cls/transactional";
import { EmailService } from "@/email/email.service";
import { ConfirmAccountDto } from "./dto/ConfirmAccount.dto";
import { requestResetPasswordDto } from "./dto/RequestResetPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";
import { DetailedUser } from "@/user/repositories/user.repository";
import { toCamelCase } from "@/common/utils/toCamelCase";

type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  @Transactional()
  public async registerUser({ email, password, userName, userSurname }: RegisterUserDto): Promise<{ message: string }> {
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException("User with this email exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const confirmationToken = randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const confirmationLink = `${process.env.FRONTEND_URL}/confirm-account?token=${confirmationToken}`;

    const user = await this.userService.createUser({
      user_name: userName,
      user_surname: userSurname,
      email,
      password_hash: hashedPassword,
      creation_date: new Date(),
      confirmation_token: confirmationToken,
      confirmation_token_expires: tokenExpiresAt,
    });

    await this.emailService.sendAccountConfirmationMail({
      confirmationLink: confirmationLink,
      email: user.email,
      userName: user.user_name,
      userSurname: user.user_surname,
    });

    if (!user) {
      throw new InternalServerErrorException("Internal Error");
    }

    return {
      message: "User successfully created!",
    };
  }

  public async loginUser({ email, password }: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.confirmation_token) {
      throw new BadRequestException("Conform your account creation");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user.id, user.role);

    return {
      access_token,
      refresh_token,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(user);
  }

  private generateRefreshToken(userId: number, role: Role): Promise<string> {
    return this.jwtService.signAsync({ userId, role }, { expiresIn: "7d", secret: process.env.JWT_SECRET });
  }

  public async validateToken(token: string) {
    try {
      const decodedJwt: User = this.jwtService.verify(token);
      if (!decodedJwt) {
        throw new UnauthorizedException("Token expired or invalid");
      }
      return await this.userService.getUserById(decodedJwt.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async getUserByToken(token: string) {
    const parsedToken: User = await this.jwtService.decode(token);

    const user = (await this.userService.getDetailedUserById(parsedToken.id)) as DetailedUser;

    if (!user) {
      throw new UnauthorizedException("Token expired or invalid");
    }

    return toCamelCase(user) as DetailedUser;
  }

  private verifyToken(token: string): { valid: boolean; expired: boolean; decoded?: Record<string, any> } {
    try {
      const decoded: Record<string, any> = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      return { valid: true, expired: false, decoded };
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        return { valid: false, expired: true };
      }
      if (error instanceof JsonWebTokenError) {
        return { valid: false, expired: false };
      }
      return { valid: false, expired: false };
    }
  }

  public async refreshToken({ email, refresh_token }: RefreshTokenDto): Promise<RefreshTokenResponse> {
    const tokenCheck = this.verifyToken(refresh_token);
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (!tokenCheck.valid && !tokenCheck.expired) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const newAccessToken = await this.generateAccessToken(user);

    if (tokenCheck.expired) {
      const newRefreshToken = await this.generateRefreshToken(user.id, user.role);
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }

    return { access_token: newAccessToken, refresh_token };
  }

  async confirmAccount({ token }: ConfirmAccountDto): Promise<{ message: string }> {
    const user = await this.userService.getUserByConfirmationToken(token);

    if (!user) {
      throw new BadRequestException("Confirmation token is invalid or expired");
    }

    await this.userService.updateFullUser(user.id, {
      confirmation_token: null,
      confirmation_token_expires: null,
    });

    return { message: "Account confirmed successfully" };
  }

  @Transactional()
  async requestResetPassword({ email }: requestResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException("Confirmation token is invalid or expired");
    }

    const resetPasswordToken = randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 10000 * 50);

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetPasswordToken}`;

    await this.userService.updateFullUser(user.id, {
      reset_password_token: resetPasswordToken,
      reset_password_token_expires: tokenExpiresAt,
    });

    await this.emailService.sendResetPasswordMail({
      email: user.email,
      resetLink,
      userName: user.user_name,
      userSurname: user.user_surname,
    });

    return {
      message: "Reset password links has been sent to your email",
    };
  }

  @Transactional()
  async resetPassword({ newPassword, newPasswordConfirmation, token }: ResetPasswordDto): Promise<{ message: string }> {
    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException("Password do not match");
    }

    const user = await this.userService.getUserByResetPasswordToken(token);

    if (!user) {
      throw new BadRequestException("Reset token invalid or expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userService.updateFullUser(user.id, {
      password_hash: hashedPassword,
      reset_password_token: null,
      reset_password_token_expires: null,
    });

    return { message: "Password has been reset successfully" };
  }
}
