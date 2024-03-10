import { Injectable } from '@nestjs/common';
import { Either, ok } from '@/core/types/either';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { IEncryptor } from '@/core/crypt/encrypter';
import { UserRole } from '@prisma/client';

interface RefreshAuthenticationServiceRequest {
  id: string;
  name: string;
  role: UserRole;
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
    id,
    name,
    role,
  }: RefreshAuthenticationServiceRequest): Promise<RefreshAuthenticationServiceResponse> {
    const accessToken = await this.encryptor.encrypt({
      sub: id,
      name,
      role,
    });

    const refreshToken = await this.encryptor.encrypt(
      {
        sub: id,
        name,
        role,
      },
      '10h',
    );

    return ok({ accessToken, refreshToken });
  }
}
