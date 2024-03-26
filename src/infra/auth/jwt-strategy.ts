import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../env/env-service';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UserRole } from '@/domain/users/entities/user';

export class TokenPayload {
  @IsNotEmpty()
  @IsUUID()
  sub!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithm: ['RS256'],
    });
  }

  async validate(payload: TokenPayload) {
    return {
      ...payload,
    };
  }
}
