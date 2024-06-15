import { Injectable } from '@nestjs/common';
import { Either, fail, ok } from '@/core/types/either';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { IEncryptor } from '@/core/crypt/encrypter';

interface RefreshAuthenticationServiceRequest {
  refreshToken?: string;
}

type RefreshAuthenticationServiceResponse = Either<
  WrongCredentialError,
  {
    accessToken: string;
    refreshToken: string;
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

    const { name, role, sub } = await this.encryptor.decrypt(_refreshToken);

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

    return ok({ accessToken, refreshToken });
  }
}
