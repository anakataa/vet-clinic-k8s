import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: User = await this.jwtService.verifyAsync(token);

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

export const UseAuth = () => UseGuards(AuthGuard);
