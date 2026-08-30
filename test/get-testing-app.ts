import { AppModule } from '@/app.module';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import {Test, type TestingModule } from '@nestjs/testing';
import { PrismaClient } from 'prisma/generated/client';
import { UserFactory } from './factories/user-factory';
import { PostFactory } from './factories/post-factory';
import { JwtModule } from '@nestjs/jwt';
import { TagFactory } from './factories/tag-factory';
import { LogFactory } from './factories/log-factory';
import { PostTagFactory } from './factories/post-tag-factory';
import { ProjectFactory } from './factories/project-factory';
import { DatabaseModule } from '@/infra/db/database.module';
import { createPgAdapter } from '@/infra/db/prisma/create-adapter';

/**
 * Prepares the app module and also overrides the PrismaService due to new
 * breaking changes from prisma client.
 */
export async function provisionTestApp() {
    const connString = process.env["DATABASE_URL"]!
    const testPrisma = new PrismaClient({ adapter: createPgAdapter(connString) });

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, JwtModule, TagFactory, LogFactory, PostTagFactory, ProjectFactory],
    })
    .overrideProvider(PrismaService)
    .useValue(testPrisma)
    .compile();

    const app = module.createNestApplication();
    return app
}