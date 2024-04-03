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
import { UserController } from './controllers/user.controller';
import { ProjectController } from './controllers/project.controller';
import { CreateProjectService } from '@/domain/projects/services/create-project-service';
import { EditProjectService } from '@/domain/projects/services/edit-project-service';
import { DeleteProjectService } from '@/domain/projects/services/delete-project-service';
import { FetchManyProjectsService } from '@/domain/projects/services/fetch-many-projects-service';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [AuthController, UserController, ProjectController],
  providers: [
    // logs /////////////////////////////

    // posts ////////////////////////////

    // projects /////////////////////////
    CreateProjectService,
    EditProjectService,
    DeleteProjectService,
    FetchManyProjectsService,

    // users ////////////////////////////
    CreateUserService,
    DeleteUserService,
    EditUserService,
    FetchManyUsersService,

    // sessions /////////////////////////
    AuthenticateService,
    RefreshAuthenticationService,
  ],
})
export class HttpModule {}
