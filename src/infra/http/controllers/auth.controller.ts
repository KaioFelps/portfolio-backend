import { AuthenticateService } from '@/domain/users/services/authenticate-service';
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
  Res,
  Header,
  Req,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { PublicRoute } from '@/infra/auth/decorators/public-route';
import type { CookieOptions, Request, Response } from 'express';
import { EnvService } from '@/infra/env/env-service';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { RefreshAuthenticationService } from '@/domain/users/services/refresh-authentication-service';

@Controller('auth')
export class AuthController {
  private refreshTokenOptions: CookieOptions;

  constructor(
    private authenticateService: AuthenticateService,
    private refreshAuthenticationService: RefreshAuthenticationService,
    private envService: EnvService,
  ) {
    this.refreshTokenOptions = {
      path: '/',
      sameSite: 'none',
      httpOnly: true,
      domain:
        this.envService.get('NODE_ENV') === 'production'
          ? this.envService.get('DOMAIN')
          : 'localhost',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Header('Access-Control-Allow-Credentials', 'true')
  @PublicRoute()
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authenticateService.exec(body);

    if (result.isFail()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message);

        default:
          throw new BadRequestException();
      }
    }
    const { accessToken, refreshToken } = result.value;

    response.cookie('refresh_token', refreshToken, this.refreshTokenOptions);

    return { access_token: accessToken };
  }

  @Post('logout')
  @HttpCode(204)
  @Header('Access-Control-Allow-Credentials', 'true')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('refresh_token', '', this.refreshTokenOptions);
  }

  @Patch('refresh')
  @HttpCode(200)
  @Header('Access-Control-Allow-Credentials', 'true')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { name, role, sub: userId } = request.user as TokenPayload;

    const result = await this.refreshAuthenticationService.exec({
      id: userId,
      name,
      role,
    });

    if (result.isFail()) {
      throw new InternalServerErrorException();
    }

    const { accessToken, refreshToken } = result.value;

    response.cookie('refresh_token', refreshToken, this.refreshTokenOptions);

    return { access_token: accessToken, refreshToken };
  }
}
