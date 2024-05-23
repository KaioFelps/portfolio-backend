import { Module } from '@nestjs/common';
import { OnPostCreated } from '@/domain/logs/subscribers/posts/on-post-created';
import { OnPostEdited } from '@/domain/logs/subscribers/posts/on-post-edited';
import { OnProjectCreated } from '@/domain/logs/subscribers/projects/on-project-created';
import { DatabaseModule } from '../db/database.module';
import { CreateLogService } from '@/domain/logs/services/create-log-service';
import { OnPostDeleted } from '@/domain/logs/subscribers/posts/on-post-deleted';

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

    // users
  ],
})
export class EventsModule {}
