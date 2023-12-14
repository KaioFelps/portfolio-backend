import { IHashComparor } from '@/core/crypt/hash-comparor';
import { IHashGenerator } from '@/core/crypt/hash-generator';

export class FakeHasher implements IHashComparor, IHashGenerator {
  private readonly HASH_SALT = 6;

  async generate(plain: string): Promise<string> {
    return `${plain}---hashed`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return hash.replace('---hashed', '') === plain;
  }
}
