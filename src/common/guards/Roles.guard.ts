import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, User } from "@prisma/client";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request: Request & { user: User } = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException("Access denied");
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Access denied");
    }

    return true;
  }
}
