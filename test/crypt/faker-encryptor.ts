import { IEncryptor } from '@/core/crypt/encrypter';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { Either, ok } from '@/core/types/either';
import { TokenPayload } from '@/infra/auth/jwt-strategy';

export class FakeEncryptor implements IEncryptor {
  async encrypt(
    payload: Record<string, unknown>,
    _expiresIn?: number | string,
  ): Promise<string> {
    return JSON.stringify(payload);
  }

  async decrypt(
    token: string,
  ): Promise<Either<UnauthorizedError, TokenPayload>> {
    return ok(JSON.parse(token));
  }
}
