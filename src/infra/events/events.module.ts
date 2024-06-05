import { Module } from '@nestjs/common';
import { OnPostCreated } from '@/domain/logs/subscribers/posts/on-post-created';
import { OnPostEdited } from '@/domain/logs/subscribers/posts/on-post-edited';
import { OnProjectCreated } from '@/domain/logs/subscribers/projects/on-project-created';
import { DatabaseModule } from '../db/database.module';
import { CreateLogService } from '@/domain/logs/services/create-log-service';
import { OnPostDeleted } from '@/domain/logs/subscribers/posts/on-post-deleted';
import { OnProjectDeleted } from '@/domain/logs/subscribers/projects/on-project-deleted';
import { OnProjectEdited } from '@/domain/logs/subscribers/projects/on-project-edited';
import { OnUserCreated } from '@/domain/logs/subscribers/users/on-user-created';
import { OnUserDeleted } from '@/domain/logs/subscribers/users/on-user-deleted';
import { OnUserEdited } from '@/domain/logs/subscribers/users/on-user-edited';

@Module({
  imports: [DatabaseModule],
  providers: [
    // services
    CreateLogService,

    // posts
    OnPostCreated,
    OnPostEdited,
    OnPostDeleted,

    // projects
    OnProjectCreated,
    OnProjectDeleted,
    OnProjectEdited,

    // users
    OnUserCreated,
    OnUserDeleted,
    OnUserEdited,
  ],
})
export class EventsModule {}
