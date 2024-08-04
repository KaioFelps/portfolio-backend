import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/statistics')
export class StatisticController {
  constructor(private prisma: PrismaService) {}

  @Get('/count')
  @HttpCode(200)
  async getTotalCounts() {
    // eslint-disable-next-line no-extend-native
    BigInt.prototype.toJSON = function (): number {
      return Number(this.toString());
    };

    const [response]: [{ total_posts: number; total_projects: number }] =
      await this.prisma.$queryRaw`
        SELECT (SELECT COUNT(*) FROM posts) as total_posts,
        (SELECT COUNT(*) FROM projects) as total_projects;`;

    return {
      totalProjects: response.total_projects,
      totalPosts: response.total_posts,
    };
  }
}
