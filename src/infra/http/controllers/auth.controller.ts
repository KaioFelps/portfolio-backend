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
import { RefreshAuthenticationService } from '@/domain/users/services/refresh-authentication-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

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
    const { accessToken, refreshToken, user } = result.value;

    response.cookie('refresh_token', refreshToken, this.refreshTokenOptions);

    return { accessToken, user };
  }

  @Post('logout')
  @HttpCode(204)
  @Header('Access-Control-Allow-Credentials', 'true')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.cleanRefreshToken(response);
  }

  @Patch('refresh')
  @HttpCode(200)
  @PublicRoute()
  @Header('Access-Control-Allow-Credentials', 'true')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refresh_token: refreshTokenCookie } = request.cookies;

    const result = await this.refreshAuthenticationService.exec({
      refreshToken: refreshTokenCookie,
    });

    if (result.isFail()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialError:
        case UnauthorizedError:
          this.cleanRefreshToken(response);
          throw new UnauthorizedException(error.message);
        default:
          throw new InternalServerErrorException();
      }
    }

    const { accessToken, refreshToken, user } = result.value;

    response.cookie('refresh_token', refreshToken, this.refreshTokenOptions);

    return { accessToken, refreshToken, user };
  }

  private cleanRefreshToken(response: Response) {
    response.cookie('refresh_token', '', this.refreshTokenOptions);
  }
}
