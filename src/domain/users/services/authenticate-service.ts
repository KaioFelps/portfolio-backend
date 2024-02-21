import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { Either, fail, ok } from '@/core/types/either';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { IHashComparor } from '@/core/crypt/hash-comparor';
import { IEncryptor } from '@/core/crypt/encrypter';

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

type AuthenticateServiceResponse = Either<
  WrongCredentialError,
  { accessToken: string }
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

    return ok({ accessToken });
  }
}
