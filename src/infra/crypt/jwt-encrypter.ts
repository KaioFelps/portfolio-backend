import { IEncryptor } from '@/core/crypt/encrypter';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayload } from '../auth/jwt-strategy';
import { EnvService } from '../env/env-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { Either, fail, ok } from '@/core/types/either';

@Injectable()
export class JwtEncryptor implements IEncryptor {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: number | string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      payload,
      !expiresIn
        ? undefined
        : {
            expiresIn,
          },
    );
  }

  async decrypt(
    token: string,
  ): Promise<Either<UnauthorizedError, TokenPayload>> {
    const privateKey = this.envService.get('JWT_PRIVATE_KEY');
    const publicKey = this.envService.get('JWT_PUBLIC_KEY');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: Buffer.from(privateKey, 'base64'),
        publicKey: Buffer.from(publicKey, 'base64'),
      });

      return ok(payload);
    } catch (err: unknown) {
      if (err instanceof JsonWebTokenError) {
        // TODO: remove this debugging console.log
        console.log(err);
        return fail(new UnauthorizedError('Invalid signature.'));
      }
      if (err instanceof TokenExpiredError) {
        return fail(new UnauthorizedError('Refresh Token has expired.'));
      }

      return fail(new UnauthorizedError());
    }
  }
}
