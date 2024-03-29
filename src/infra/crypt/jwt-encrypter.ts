import { IEncryptor } from '@/core/crypt/encrypter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncryptor implements IEncryptor {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>, expiresIn?: number | string): Promise<string> {
    return await this.jwtService.signAsync(payload, !expiresIn ? undefined : {
      expiresIn: expiresIn
    });
  }
}
