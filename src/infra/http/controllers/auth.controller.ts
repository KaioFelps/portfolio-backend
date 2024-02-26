import { AuthenticateService } from '@/domain/users/services/authenticate-service';
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login';
import { WrongCredentialError } from '@/core/errors/wrong-credentials-error';
import { PublicRoute } from '@/infra/auth/decorators/public-route';

@Controller('auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  async login(@Body() body: LoginDto) {
    const response = await this.authenticateService.exec(body);

    if (response.isFail()) {
      const error = response.value;

      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message);

        default:
          throw new BadRequestException();
      }
    }
    const { accessToken } = response.value;

    return { access_token: accessToken };
  }
}
