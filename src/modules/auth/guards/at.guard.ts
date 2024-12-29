import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/is-public.decorator';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { IAuthRequest } from 'src/interfaces/auth-request.interface';
import { UserActivityRegistry } from 'src/modules/user/user.registry';
@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  _logger = new Logger(AtGuard.name);
  constructor(
    private reflector: Reflector,
    private userActivityRegistry: UserActivityRegistry
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
      context.getClass()
    ]);
  }

  validateRoles(context: ExecutionContext): boolean {
    const roles = this.getReflector<string[]>(ROLES_KEY, context);
    const user = context.switchToHttp().getRequest<IAuthRequest>().user;

    if (!roles) return true; // Nenhuma permissão necessária
    if (!user) return false; // Usuário não encontrado

    this.userActivityRegistry.registerActivity(`${user.id}`);

    if (roles.includes(user.role)) {
      return true;
    }

    this._logger.error(`
      \rAcesso negado para: ${user.email}
      \rPermissões necessárias: [${roles.join(', ')}]
      \rPermissões atuais: [${user.role}]
    `);

    return false;
  }
}
