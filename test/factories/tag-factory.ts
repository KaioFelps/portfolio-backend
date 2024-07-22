import { Optional } from '@/core/types/optional';

import { Tag, TagProps } from '@/domain/tags/entities/tag';
import { PrismaTagMapper } from '@/infra/db/prisma/mappers/prisma-tag-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagFactory {
  constructor(private prisma: PrismaService) {}

  static exec(override?: Optional<TagProps, 'value'>) {
    return Tag.create({
      value: faker.word.words({ count: { min: 1, max: 3 } }),
      ...override,
    });
  }

  public async createAndPersist(override?: Optional<TagProps, 'value'>) {
    const tag = TagFactory.exec(override);

    await this.prisma.tag.create({
      data: PrismaTagMapper.toPrisma(tag),
    });

    return tag;
  }
}
