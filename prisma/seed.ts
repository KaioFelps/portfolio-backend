import { EntityUniqueId } from '../src/core/entities/entity-unique-id';
import { ProjectFactory } from '../test/factories/project-factory';
import { PrismaService } from '../src/infra/db/prisma/prisma-service';
import { PostFactory } from 'test/factories/post-factory';
import { IHashGenerator } from '@/core/crypt/hash-generator';
import { DomainEvents } from '@/core/events/domain-events';

export async function run(prisma: PrismaService, hasher: IHashGenerator) {
  const user1 = new EntityUniqueId();
  const user2 = new EntityUniqueId();

  await populateUsers(prisma, hasher, [user1.toValue(), user2.toValue()]);
  await populateProjects(prisma);
  await populatePosts(prisma, [user1, user2]);
}

async function populateUsers(
  prisma: PrismaService,
  hasher: IHashGenerator,
  [user1, user2]: [string, string],
) {
  try {
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
  } catch {}
}

async function populateProjects(prisma: PrismaService) {
  try {
    const projectFactory = new ProjectFactory(prisma);

    const project1 = await projectFactory.createAndPersist();
    const project2 = await projectFactory.createAndPersist();

    DomainEvents.dispatchEventsForAggregate(project1.id);
    DomainEvents.dispatchEventsForAggregate(project2.id);
  } catch {}
}

async function populatePosts(
  prisma: PrismaService,
  [user1, user2]: [EntityUniqueId, EntityUniqueId],
) {
  try {
    const postFactory = new PostFactory(prisma);

    const post1 = await postFactory.createAndPersist({
      authorId: user1,
      content: '<h1>Post 1</h1>',
      title: 'First post',
      topstory: '',
    });
    DomainEvents.dispatchEventsForAggregate(post1.id);

    const post2 = await postFactory.createAndPersist({
      authorId: user2,
      content: '<h1>Post 2</h1>',
      title: 'Second post',
      topstory: '',
    });
    DomainEvents.dispatchEventsForAggregate(post2.id);

    const post3 = await postFactory.createAndPersist({
      authorId: user1,
      content: '<h1>Post 3</h1>',
      title: 'Third post',
      topstory: '',
    });
    DomainEvents.dispatchEventsForAggregate(post3.id);
  } catch {}
}
