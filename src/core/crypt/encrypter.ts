import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { Either } from '../types/either';

export abstract class IEncryptor {
  abstract encrypt(
    payload: Record<string, unknown>,
    /**
     * expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
     */
    expiresIn?: number | string,
  ): Promise<string>;

  abstract decrypt(
    token: string,
  ): Promise<Either<UnauthorizedError, TokenPayload>>;
}
