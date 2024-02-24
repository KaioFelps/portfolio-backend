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

@Controller('auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const response = await this.authenticateService.exec(body);

    if (response.isFail()) {
      const error = response.value;

      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message);
          break;

        default:
          throw new BadRequestException();
          break;
      }
    }
    const { accessToken } = response.value;

    return { access_token: accessToken };
  }
}
