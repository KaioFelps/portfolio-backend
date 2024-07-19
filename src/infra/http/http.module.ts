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
import { PostController } from './controllers/post.controller';
import { LogController } from './controllers/log.controller';
import { CreatePostService } from '@/domain/posts/services/create-post-service';
import { EditPostService } from '@/domain/posts/services/edit-post-service';
import { DeletePostService } from '@/domain/posts/services/delete-post-service';
import { GetPostBySlugService } from '@/domain/posts/services/get-post-by-slug-service';
import { FetchManyPostsService } from '@/domain/posts/services/fetch-many-posts-service';
import { FetchManyLogsService } from '@/domain/logs/services/fetch-many-logs-service';
import { TogglePostVisibilityService } from '@/domain/posts/services/toggle-post-visibility-service';
import { FetchManyPublishedPostsService } from '@/domain/posts/services/fetch-many-published-posts-service';
import { StatisticController } from './controllers/statistic.controller';

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    AuthController,
    UserController,
    ProjectController,
    PostController,
    LogController,
    StatisticController,
  ],
  providers: [
    // logs /////////////////////////////
    FetchManyLogsService,

    // posts ////////////////////////////
    CreatePostService,
    EditPostService,
    DeletePostService,
    GetPostBySlugService,
    FetchManyPostsService,
    FetchManyPublishedPostsService,
    TogglePostVisibilityService,

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
