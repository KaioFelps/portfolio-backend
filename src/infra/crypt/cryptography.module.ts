import { IEncryptor } from '@/core/crypt/encrypter';
import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { IHashGenerator } from '@/core/crypt/hash-generator';
import { JwtEncryptor } from './jwt-encrypter';
import { IHashComparor } from '@/core/crypt/hash-comparor';

@Module({
  providers: [
    {
      provide: IEncryptor,
      useClass: JwtEncryptor,
    },
    {
      provide: IHashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: IHashComparor,
      useClass: BcryptHasher,
    },
  ],
  exports: [IEncryptor, IHashComparor, IHashGenerator],
})
export class CryptographyModule {}
