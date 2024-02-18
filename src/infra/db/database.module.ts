import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma-service';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [PrismaService, IUsersRepository],
})
export class DatabaseModule {}
