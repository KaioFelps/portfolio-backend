import { PostFactory } from 'test/factories/post-factory';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { OnPostEdited } from './on-post-edited';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createLogService: CreateLogService;

let registerEditedPostSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On post edited subscriber', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryLogsRepository = new InMemoryLogsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerEditedPostSpy = vi.spyOn(createLogService, 'exec');

    new OnPostEdited(createLogService);
  });

  it('should register a log when a post is edited', async () => {
    const post = PostFactory.exec();

    inMemoryPostsRepository.items.push(post);

    post.title = 'título novo';
    inMemoryPostsRepository.save(post);

    await waitFor(() => {
      expect(registerEditedPostSpy).toHaveBeenCalled();
    });
  });
});
