import { IEncryptor } from '@/core/crypt/encrypter';
import { TokenPayload } from '@/infra/auth/jwt-strategy';

export class FakeEncryptor implements IEncryptor {
  async encrypt(
    payload: Record<string, unknown>,
    _expiresIn?: number | string,
  ): Promise<string> {
    return JSON.stringify(payload);
  }

  async decrypt(token: string): Promise<TokenPayload> {
    return JSON.parse(token);
  }
}
