import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // roles requeridos por el handler
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // si no se exige rol, se permite el acceso (solo se validará JWT si está el AuthGuard)
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { roles?: string[] } | undefined;

    if (!user || !user.roles) return false;

    return requiredRoles.some((role) => user.roles!.includes(role));
  }
}
