import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma-service';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { IProjectsRepository } from '@/domain/projects/repositories/projects-repository';
import { PrismaProjectsRepository } from './prisma/repositories/prisma-projects-repository';
import { PrismaProjectLinksRepository } from './prisma/repositories/prisma-project-links-repository';
import { IProjectLinksRepository } from '@/domain/projects/repositories/project-links-repository';
import { PrismaProjectTagsRepository } from './prisma/repositories/prisma-project-tag-repository';
import { IProjectTagsRepository } from '@/domain/projects/repositories/project-tags-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IProjectsRepository,
      useClass: PrismaProjectsRepository,
    },
    {
      provide: IProjectLinksRepository,
      useClass: PrismaProjectLinksRepository,
    },
    {
      provide: IProjectTagsRepository,
      useClass: PrismaProjectTagsRepository,
    },
  ],
  exports: [
    PrismaService,
    IUsersRepository,
    IProjectsRepository,
    IProjectLinksRepository,
    IProjectTagsRepository,
  ],
})
export class DatabaseModule {}
