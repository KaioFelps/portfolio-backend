import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { GetPostBySlugService } from './get-post-by-slug-service';

describe('Get Post By Slug Service', () => {
  let sut: GetPostBySlugService;
  let postsRepository: InMemoryPostsRepository;

  beforeEach(async () => {
    postsRepository = new InMemoryPostsRepository();
    sut = new GetPostBySlugService(postsRepository);
  });

  it('should get a post by slug', async () => {
    const post = PostFactory.exec({ tags: [], title: 'design de fs' });

    postsRepository.items.push(post);

    const result = await sut.exec({
      slug: post.slug,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.post).toEqual(post);
  });
});
