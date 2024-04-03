import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role === Role.ADMIN) {
      return true;
    }

    const userId = request.user.id;
    if (user.id === userId) {
      return true;
    }

    return false;
  }
}
