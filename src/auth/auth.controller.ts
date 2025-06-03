import {
  Body,
  Controller,
  Post,
  Get,
  Headers,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/RegisterUser.dto";
import { LoginDto } from "./dto/Login.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { RefreshTokenDto } from "./dto/RefreshToken.dto";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { ConfirmAccountDto } from "./dto/ConfirmAccount.dto";
import { requestResetPasswordDto } from "./dto/RequestResetPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user", description: "Creates a new user account." })
  @ApiResponse({ status: 201, description: "User successfully registered." })
  @ApiResponse({ status: 409, description: "User with this email already exists." })
  @ApiResponse({ status: 400, description: "Validation failed (missing fields, incorrect formats, etc.)." })
  @Post("register")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  @ApiOperation({ summary: "User login", description: "Logs in a user and returns access & refresh tokens." })
  @ApiResponse({ status: 200, description: "Login successful." })
  @ApiResponse({ status: 401, description: "Invalid credentials (wrong email or password)." })
  @ApiResponse({ status: 400, description: "Validation failed (missing fields, incorrect formats, etc.)." })
  @Post("login")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginDto) {
    return this.authService.loginUser(body);
  }

  @ApiOperation({
    summary: "Validate JWT token",
    description: "Checks if the provided token is valid and not expired.",
  })
  @ApiResponse({ status: 200, description: "Token is valid." })
  @ApiResponse({ status: 401, description: "Invalid or expired token." })
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard)
  @Get("validate")
  async validateToken(@Headers("Authorization") token: string) {
    if (!token) {
      throw new BadRequestException("Auth token missing");
    }
    return this.authService.validateToken(token.replace("Bearer ", ""));
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get user info from token",
    description: "Retrieves the user associated with the given JWT token.",
  })
  @ApiResponse({ status: 200, description: "User data retrieved successfully." })
  @ApiResponse({ status: 401, description: "Invalid or expired token." })
  @ApiBearerAuth("access-token")
  async getUserByToken(@Headers("Authorization") token: string) {
    return this.authService.getUserByToken(token.replace("Bearer ", ""));
  }

  @ApiOperation({ summary: "Refresh token", description: "Generates a new access token using a valid refresh token." })
  @ApiResponse({ status: 200, description: "New access token generated." })
  @ApiResponse({ status: 401, description: "Invalid or expired refresh token." })
  @ApiResponse({ status: 400, description: "Validation failed (missing fields, incorrect formats, etc.)." })
  @Post("refresh")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @Get("confirm-account")
  @ApiOperation({ summary: "Confirm user account via token" })
  @ApiResponse({ status: 200, description: "Account description successfully." })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  async confirmAccount(@Query() dto: ConfirmAccountDto) {
    return this.authService.confirmAccount(dto);
  }

  @Post("request-reset-password")
  @ApiOperation({ summary: "Request reset password link" })
  @ApiResponse({ status: 200, description: "Reset password link sent if email is correct" })
  async requestResetPassword(@Body() requestResetPasswordDto: requestResetPasswordDto) {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }

  @Post("reset-password")
  @ApiOperation({ summary: "Reset password and set new password" })
  @ApiResponse({ status: 200, description: "Password reset successfully" })
  @ApiResponse({ status: 400, description: "Link has been expired" })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
