import { EntityUniqueId } from '../src/core/entities/entity-unique-id';
import { Slug } from '../src/domain/posts/entities/value-objects/slug';
import { BcryptHasher } from '../src/infra/crypt/bcrypt-hasher';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const hasher = new BcryptHasher();

async function main() {
  const user1 = new EntityUniqueId();
  const user2 = new EntityUniqueId();

  await populateUsers(user1.toValue(), user2.toValue());
  await populateProjects();
  await populatePosts(user1.toValue(), user2.toValue());
}

main()
  .catch(async (e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function populateUsers(user1: string, user2: string) {
  return await prisma.user.createMany({
    data: [
      {
        email: 'kaio@gmail.com',
        name: 'Kaio Felipe',
        password: await hasher.generate('123456'),
        role: 'ADMIN',
        id: user1,
      },
      {
        email: 'John@gmail.com',
        name: 'John DOe',
        password: await hasher.generate('12345690'),
        role: 'EDITOR',
        id: user2,
      },
    ],
  });
}

async function populateProjects() {
  await prisma.project.createMany({
    data: [
      {
        title: 'Hidro Mourão',
        topstory: 'imgur.com',
      },
      {
        title: 'Cosmic CMS',
        topstory: 'imgur.com',
      },
    ],
  });
}

async function populatePosts(user1: string, user2: string) {
  const post1 = new EntityUniqueId();
  const post2 = new EntityUniqueId();
  const post3 = new EntityUniqueId();
  await prisma.post.createMany({
    data: [
      {
        authorId: user1,
        content: '<h1>Post 1</h1>',
        slug: Slug.fromTitle('First post', post1.toValue()).value,
        title: 'First post',
        topstory: '',
        id: post1.toValue(),
      },
      {
        authorId: user2,
        content: '<h1>Post 2</h1>',
        slug: Slug.fromTitle('Second post', post2.toValue()).value,
        title: 'Second post',
        topstory: '',
        id: post2.toValue(),
      },
      {
        authorId: user1,
        content: '<h1>Post 3</h1>',
        slug: Slug.fromTitle('Third post', post3.toValue()).value,
        title: 'Third post',
        topstory: '',
        id: post3.toValue(),
      },
    ],
  });
}
