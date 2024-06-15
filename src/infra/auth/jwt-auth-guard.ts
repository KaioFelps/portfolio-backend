import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC } from './decorators/public-route';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../env/env-service';
import { TokenPayload } from './jwt-strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private envService: EnvService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getClass(),
      context.getHandler(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    let payload: TokenPayload | null = null;

    try {
      const privateKey = this.envService.get('JWT_PRIVATE_KEY');
      const publicKey = this.envService.get('JWT_PUBLIC_KEY');

      payload = (await this.jwtService.verifyAsync(token!, {
        secret: Buffer.from(privateKey, 'base64'),
        publicKey: Buffer.from(publicKey, 'base64'),
      })) as TokenPayload;
    } catch {
      if (isPublic) {
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }

    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
