import { FastifyReply, FastifyRequest } from 'fastify';
import { Post } from '@domain/post/entities/post';
import {
  create,
  getById,
  list,
  search,
  update
} from '@infrastructure/http/controllers/post';
import {
  makeCreatePost,
  makeGetPostById,
  makeListPosts,
  makeSearchPosts,
  makeUpdatePost
} from '@infrastructure/http/factories/post';

jest.mock('@infrastructure/http/factories/post', () => ({
  makeCreatePost: jest.fn(),
  makeGetPostById: jest.fn(),
  makeListPosts: jest.fn(),
  makeSearchPosts: jest.fn(),
  makeUpdatePost: jest.fn(),
  makeDeletePost: jest.fn()
}));

const makeCreatePostMock = makeCreatePost as jest.MockedFunction<
  typeof makeCreatePost
>;
const makeGetPostByIdMock = makeGetPostById as jest.MockedFunction<
  typeof makeGetPostById
>;
const makeListPostsMock = makeListPosts as jest.MockedFunction<
  typeof makeListPosts
>;
const makeSearchPostsMock = makeSearchPosts as jest.MockedFunction<
  typeof makeSearchPosts
>;
const makeUpdatePostMock = makeUpdatePost as jest.MockedFunction<
  typeof makeUpdatePost
>;

function buildReply(): FastifyReply {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  } as unknown as FastifyReply;
}

function expectNoPrivateFields(value: unknown): void {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => expectNoPrivateFields(item));
    return;
  }

  for (const key of Object.keys(value as Record<string, unknown>)) {
    expect(key.startsWith('_')).toBe(false);
  }
}

describe('Post controllers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should serialize payload on create', async () => {
    const post = new Post({
      title: 'Post title',
      content: 'Post content',
      author: 'Author'
    });

    makeCreatePostMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(post)
    } as unknown as ReturnType<typeof makeCreatePost>);

    const request = {
      body: {
        title: 'Post title',
        content: 'Post content',
        author: 'Author'
      }
    } as FastifyRequest;

    const reply = buildReply();

    await create(request, reply);

    expect(reply.status).toHaveBeenCalledWith(201);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.data.id).toBe(post.id.toString());
    expect(payload.data.createdAt).toBeInstanceOf(Date);
    expect(payload.data.updatedAt).toBeInstanceOf(Date);
    expectNoPrivateFields(payload.data);
  });

  it('should serialize payload on getById', async () => {
    const post = new Post({
      title: 'Post title',
      content: 'Post content',
      author: 'Author'
    });

    makeGetPostByIdMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(post)
    } as unknown as ReturnType<typeof makeGetPostById>);

    const request = {
      params: { id: post.id.toString() }
    } as FastifyRequest;

    const reply = buildReply();

    await getById(request, reply);

    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.data.id).toBe(post.id.toString());
    expectNoPrivateFields(payload.data);
  });

  it('should serialize payload on list', async () => {
    const posts = [
      new Post({ title: 'Post 1', content: 'Content 1', author: 'Author 1' }),
      new Post({ title: 'Post 2', content: 'Content 2', author: 'Author 2' })
    ];

    makeListPostsMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue({ posts, total: 2 })
    } as unknown as ReturnType<typeof makeListPosts>);

    const request = {
      query: { limit: '10', skip: '0' }
    } as FastifyRequest;

    const reply = buildReply();

    await list(request, reply);

    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.data).toHaveLength(2);
    expect(payload.data[0].id).toBe(posts[0].id.toString());
    expect(payload.data[1].id).toBe(posts[1].id.toString());
    expectNoPrivateFields(payload.data);
  });

  it('should serialize payload on search', async () => {
    const posts = [
      new Post({ title: 'Post 1', content: 'Content 1', author: 'Author 1' })
    ];

    makeSearchPostsMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(posts)
    } as unknown as ReturnType<typeof makeSearchPosts>);

    const request = {
      query: { q: 'Post' }
    } as FastifyRequest;

    const reply = buildReply();

    await search(request, reply);

    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.data).toHaveLength(1);
    expect(payload.data[0].id).toBe(posts[0].id.toString());
    expectNoPrivateFields(payload.data);
  });

  it('should serialize payload on update', async () => {
    const post = new Post({
      title: 'Post title',
      content: 'Post content',
      author: 'Author'
    });

    makeUpdatePostMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(post)
    } as unknown as ReturnType<typeof makeUpdatePost>);

    const request = {
      params: { id: post.id.toString() },
      body: { title: 'Updated title' }
    } as FastifyRequest;

    const reply = buildReply();

    await update(request, reply);

    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.data.id).toBe(post.id.toString());
    expectNoPrivateFields(payload.data);
  });
});
