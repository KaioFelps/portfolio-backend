import { IHashComparor } from '@/core/crypt/hash-comparor';
import { IHashGenerator } from '@/core/crypt/hash-generator';
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements IHashComparor, IHashGenerator {
  private readonly HASH_SALT = 6;

  async generate(plain: string): Promise<string> {
    return await hash(plain, this.HASH_SALT);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
