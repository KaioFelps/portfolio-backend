import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { Either, fail, ok } from '@/core/types/either';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { IHashComparor } from '@/core/crypt/hash-comparor';
import { IEncryptor } from '@/core/crypt/encrypter';
import { UserRole } from '../entities/user';

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

type AuthenticateServiceResponse = Either<
  WrongCredentialError,
  {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; role: UserRole };
  }
>;

@Injectable()
export class AuthenticateService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashComparor: IHashComparor,
    private encryptor: IEncryptor,
  ) {}

  async exec({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return fail(new WrongCredentialError());
    }

    const isPasswordValid = await this.hashComparor.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return fail(new WrongCredentialError());
    }

    const accessToken = await this.encryptor.encrypt({
      sub: user.id.toValue(),
      name: user.name,
      role: user.role,
    });

    const refreshToken = await this.encryptor.encrypt(
      {
        sub: user.id.toValue(),
        name: user.name,
        role: user.role,
      },
      '10h',
    );

    return ok({
      accessToken,
      refreshToken,
      user: { id: user.id.toValue(), name: user.name, role: user.role },
    });
  }
}
