import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthenticateService } from '@/domain/users/services/authenticate-service';
import { CryptographyModule } from '../crypt/cryptography.module';
import { DatabaseModule } from '../db/database.module';
import { CreateUserService } from '@/domain/users/services/create-user-service';
import { DeleteUserService } from '@/domain/users/services/delete-user-service';
import { EditUserService } from '@/domain/users/services/edit-user-service';
import { RefreshAuthenticationService } from '@/domain/users/services/refresh-authentication-service';
import { FetchManyUsersService } from '@/domain/users/services/fetch-many-users-service';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [AuthController],
  providers: [
    // logs ///////////////////////////

    // posts ///////////////////////////

    // projects ///////////////////////////

    // users ///////////////////////////
    AuthenticateService,
    CreateUserService,
    DeleteUserService,
    EditUserService,
    RefreshAuthenticationService,
    FetchManyUsersService,
  ],
})
export class HttpModule {}
