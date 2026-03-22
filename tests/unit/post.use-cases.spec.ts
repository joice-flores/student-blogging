import {
  CreatePost,
  ListPosts,
  GetPostById,
  UpdatePost,
  DeletePost,
  SearchPosts
} from '@application/post';
import { Post, IPostRepository, PostId } from '@domain/post';
import { AppError } from '@shared/errors/builder/app-error';

describe('Post Use Cases', () => {
  let postRepository: jest.Mocked<IPostRepository>;

  beforeEach(() => {
    postRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn()
    };
  });

  describe('CreatePost', () => {
    it('should create a post successfully', async () => {
      const useCase = new CreatePost(postRepository);

      const result = await useCase.execute({
        title: 'Test',
        content: 'Content',
        author: 'Author'
      });

      expect(result).toBeInstanceOf(Post);
      expect(result.title).toBe('Test');
      expect(result.content).toBe('Content');
      expect(result.author).toBe('Author');
      expect(postRepository.create).toHaveBeenCalledTimes(1);
      expect(postRepository.create).toHaveBeenCalledWith(result);
    });

    it('should throw validation error if title is missing', async () => {
      const useCase = new CreatePost(postRepository);

      await expect(
        useCase.execute({ title: '', content: 'Content', author: 'Author' })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw validation error if content is missing', async () => {
      const useCase = new CreatePost(postRepository);

      await expect(
        useCase.execute({ title: 'Test', content: '', author: 'Author' })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw validation error if author is missing', async () => {
      const useCase = new CreatePost(postRepository);

      await expect(
        useCase.execute({ title: 'Test', content: 'Content', author: '' })
      ).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('ListPosts', () => {
    it('should list posts', async () => {
      const posts = [
        new Post({ title: 'Post 1', content: 'Content 1', author: 'Author 1' }),
        new Post({ title: 'Post 2', content: 'Content 2', author: 'Author 2' })
      ];

      postRepository.findAllPaginated.mockResolvedValue({ posts, total: 2 });

      const useCase = new ListPosts(postRepository);

      const result = await useCase.execute({ limit: 10, skip: 0 });

      expect(result.posts).toHaveLength(2);
      expect(result.posts[0]).toBeInstanceOf(Post);
      expect(result.total).toBe(2);
      expect(postRepository.findAllPaginated).toHaveBeenCalledTimes(1);
      expect(postRepository.findAllPaginated).toHaveBeenCalledWith({
        limit: 10,
        skip: 0
      });
    });
  });

  describe('GetPostById', () => {
    it('should return a post by id', async () => {
      const post = new Post({
        title: 'Test',
        content: 'Content',
        author: 'Author'
      });

      postRepository.findById.mockResolvedValue(post);

      const useCase = new GetPostById(postRepository);

      const result = await useCase.execute({ id: post.id.toString() });

      expect(result).toBe(post);
      expect(postRepository.findById).toHaveBeenCalledTimes(1);
      const calledId = postRepository.findById.mock.calls[0][0] as PostId;
      expect(calledId.toString()).toBe(post.id.toString());
    });

    it('should throw not found error if post does not exist', async () => {
      postRepository.findById.mockResolvedValue(null);

      const useCase = new GetPostById(postRepository);

      await expect(
        useCase.execute({ id: 'non-existent-id' })
      ).rejects.toMatchObject({
        statusCode: 404
      });
    });
  });

  describe('UpdatePost', () => {
    it('should update a post successfully when it exists', async () => {
      const existingPost = new Post({
        title: 'Old',
        content: 'Old content',
        author: 'Author'
      });

      const updatedPost = new Post({
        id: existingPost.id,
        title: 'Updated',
        content: 'Updated content',
        author: existingPost.author,
        createdAt: existingPost.createdAt,
        updatedAt: new Date()
      });

      postRepository.findById.mockResolvedValue(existingPost);
      postRepository.update.mockResolvedValue(updatedPost);

      const useCase = new UpdatePost(postRepository);

      const result = await useCase.execute({
        id: existingPost.id.toString(),
        title: 'Updated',
        content: 'Updated content'
      });

      expect(result.title).toBe('Updated');
      expect(result.content).toBe('Updated content');
      expect(postRepository.findById).toHaveBeenCalledTimes(1);
      expect(postRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw not found error if post does not exist', async () => {
      postRepository.findById.mockResolvedValue(null);

      const useCase = new UpdatePost(postRepository);

      await expect(
        useCase.execute({ id: 'non-existent-id', title: 'New', content: 'New' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw not found error if repository returns null on update', async () => {
      const existingPost = new Post({
        title: 'Old',
        content: 'Old content',
        author: 'Author'
      });

      postRepository.findById.mockResolvedValue(existingPost);
      postRepository.update.mockResolvedValue(null);

      const useCase = new UpdatePost(postRepository);

      await expect(
        useCase.execute({
          id: existingPost.id.toString(),
          title: 'Updated',
          content: 'Updated content'
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should not update the post when title or content is missing', async () => {
      const existingPost = new Post({
        title: 'Old',
        content: 'Old content',
        author: 'Author'
      });

      const updateSpy = jest.spyOn(existingPost, 'update');

      postRepository.findById.mockResolvedValue(existingPost);
      postRepository.update.mockResolvedValue(existingPost);

      const useCase = new UpdatePost(postRepository);

      await useCase.execute({
        id: existingPost.id.toString(),
        title: 'Only title'
      });

      expect(updateSpy).not.toHaveBeenCalled();
      expect(postRepository.update).toHaveBeenCalledWith(existingPost);
    });
  });

  describe('DeletePost', () => {
    it('should delete a post successfully', async () => {
      postRepository.delete.mockResolvedValue(true);

      const useCase = new DeletePost(postRepository);

      const result = await useCase.execute({ id: 'any-id' });

      expect(result).toBe(true);
      expect(postRepository.delete).toHaveBeenCalledTimes(1);
      const calledId = postRepository.delete.mock.calls[0][0] as PostId;
      expect(calledId.toString()).toBe('any-id');
    });

    it('should throw not found error if delete returns false', async () => {
      postRepository.delete.mockResolvedValue(false);

      const useCase = new DeletePost(postRepository);

      await expect(
        useCase.execute({ id: 'non-existent-id' })
      ).rejects.toMatchObject({
        statusCode: 404
      });
    });
  });

  describe('SearchPosts', () => {
    it('should search posts by query', async () => {
      const posts = [
        new Post({ title: 'NestJS post', content: 'Content', author: 'Author' })
      ];

      postRepository.search.mockResolvedValue(posts);

      const useCase = new SearchPosts(postRepository);

      const result = await useCase.execute({ query: 'NestJS' });

      expect(result).toEqual(posts);
      expect(postRepository.search).toHaveBeenCalledTimes(1);
      expect(postRepository.search).toHaveBeenCalledWith('NestJS');
    });
  });
});
