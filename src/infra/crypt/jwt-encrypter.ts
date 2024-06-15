import { IEncryptor } from '@/core/crypt/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../auth/jwt-strategy';
import { EnvService } from '../env/env-service';

@Injectable()
export class JwtEncryptor implements IEncryptor {
  constructor(
    private jwtService: JwtService,
    private envService: EnvService,
  ) {}

  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: number | string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      payload,
      !expiresIn
        ? undefined
        : {
            expiresIn,
          },
    );
  }

  async decrypt(token: string): Promise<TokenPayload> {
    const privateKey = this.envService.get('JWT_PRIVATE_KEY');
    const publicKey = this.envService.get('JWT_PUBLIC_KEY');

    const payload = await this.jwtService.verifyAsync(token, {
      secret: Buffer.from(privateKey, 'base64'),
      publicKey: Buffer.from(publicKey, 'base64'),
    });

    return payload;
  }
}
