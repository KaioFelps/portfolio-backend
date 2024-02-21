import { IEncryptor } from '@/core/crypt/encrypter';

export class FakeEncryptor implements IEncryptor {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
