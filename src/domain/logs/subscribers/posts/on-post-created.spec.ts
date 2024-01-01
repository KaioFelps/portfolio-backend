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
import { OnPostCreated } from './on-post-created';

let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createLogService: CreateLogService;

let registerCreatedPostSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On post created subscriber', async () => {
  beforeEach(() => {
    inMemoryPostsRepository = new InMemoryPostsRepository();
    inMemoryLogsRepository = new InMemoryLogsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerCreatedPostSpy = vi.spyOn(createLogService, 'exec');

    new OnPostCreated(createLogService);
  });

  it('should register a log when a post is created', async () => {
    const post = PostFactory.exec();

    inMemoryPostsRepository.create(post);

    await waitFor(() => {
      expect(registerCreatedPostSpy).toHaveBeenCalled();
    });
  });
});
