import {
  Tag as PrismaTag,
  TagsOnPostsOrProjects as PrismaTagsOnPostsOrProjects,
} from 'prisma/generated/client';

export type PrismaComposedTag = PrismaTagsOnPostsOrProjects & {
  Tag: PrismaTag;
};
