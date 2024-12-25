import { Injectable } from '@nestjs/common';
import { Either, fail, ok } from '@/core/types/either';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { IEncryptor } from '@/core/crypt/encrypter';
import { UserRole } from '../entities/user';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface RefreshAuthenticationServiceRequest {
  refreshToken?: string;
}

type RefreshAuthenticationServiceResponse = Either<
  WrongCredentialError | UnauthorizedError,
  {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; role: UserRole };
  }
>;

@Injectable()
export class RefreshAuthenticationService {
  constructor(private encryptor: IEncryptor) {}

  async exec({
    refreshToken: _refreshToken,
  }: RefreshAuthenticationServiceRequest): Promise<RefreshAuthenticationServiceResponse> {
    if (!_refreshToken) {
      return fail(new WrongCredentialError());
    }

    const payload = await this.encryptor.decrypt(_refreshToken);

    if (payload.isFail()) {
      return fail(payload.value);
    }

    const { name, role, sub } = payload.value;

    const accessToken = await this.encryptor.encrypt({
      sub,
      name,
      role,
    });

    const refreshToken = await this.encryptor.encrypt(
      {
        sub,
        name,
        role,
      },
      '10h',
    );

    return ok({ accessToken, refreshToken, user: { id: sub, name, role } });
  }
}
