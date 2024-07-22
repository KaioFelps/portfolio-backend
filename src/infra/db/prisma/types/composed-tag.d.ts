import {
  Tag as PrismaTag,
  TagsOnPostsOrProjects as PrismaTagsOnPostsOrProjects,
} from 'prisma/prisma-client';

export type PrismaComposedTag = PrismaTagsOnPostsOrProjects & {
  Tag: PrismaTag;
};
