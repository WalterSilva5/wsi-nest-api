import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/cruds/auth/decorators/is-public.decorator';
import { ROLES_KEY } from 'src/cruds/auth/decorators/role.decorator';
import { AuthRequestDTO } from 'src/cruds/auth/dto/auth-request.dto';
import { UserActivityRegistry } from 'src/cruds/user/user.registry';
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  _logger = new Logger(AtGuard.name);
  constructor(
    private reflector: Reflector,
    private userActivityRegistry: UserActivityRegistry,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.getReflector(IS_PUBLIC_KEY, context);
    if (isPublic) return true;

    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    const canActivatePromise = canActivate as Promise<boolean>;

    return canActivatePromise
      .then(async (result) => {
        if (result == false) return false;
        return this.validateRoles(context);
      })
      .catch((_: any) => {
        throw new UnauthorizedException();
      });
  }

  getReflector<T = boolean>(metadataKey: string, context: ExecutionContext) {
    return this.reflector.getAllAndOverride<T>(metadataKey, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  validateRoles(context: ExecutionContext): boolean {
    const roles = this.getReflector<string[]>(ROLES_KEY, context);
    const user = context.switchToHttp().getRequest<AuthRequestDTO>().user;

    if (!roles) return true; // no roles required
    if (!user) return false; // user not required

    this.userActivityRegistry.registerActivity(`${user.id}`);

    if (roles.includes(user.role)) {
      return true;
    }

    this._logger.error(`
      \rAccess denied for: ${user.email}
      \rRequired permissions: [${roles.join(', ')}]
      \rCurrent permissions: [${user.role}]
    `);

    return false;
  }
}
