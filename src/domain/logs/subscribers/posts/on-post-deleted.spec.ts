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
import { OnPostDeleted } from './on-post-deleted';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createLogService: CreateLogService;

let registerDeletedPostSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On post deleted subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryUsersRepository,
    );

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerDeletedPostSpy = vi.spyOn(createLogService, 'exec');

    new OnPostDeleted(createLogService);
  });

  it('should register a log when a post is deleted', async () => {
    const post = PostFactory.exec();
    inMemoryPostsRepository.items.push(post);

    post.addDeletedEventToDispatch();
    inMemoryPostsRepository.delete(post);

    await waitFor(() => {
      expect(registerDeletedPostSpy).toHaveBeenCalled();
    });
  });
});
