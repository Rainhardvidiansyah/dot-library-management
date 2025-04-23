
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  private logger = new Logger(RolesGuard.name, {timestamp: true});

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    this.logger.log('Roles Guard class is hit');

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // return requiredRoles.some((role) => user.roles?.includes(role));
    

    return requiredRoles.some((role) => user.role.includes(role));
  }
}


//Original source I've read: https://docs.nestjs.com/security/authorization