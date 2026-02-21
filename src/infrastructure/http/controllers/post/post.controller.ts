import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPosts
} from '@application/use-cases/post';
import {
  createPostSchema,
  updatePostSchema,
  searchPostSchema
} from '@application/dtos/post.validation';
import { validateOrThrow } from '@shared/utils/validation';

export class PostController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = validateOrThrow(createPostSchema, request.body);
    const post = await createPost(data);

    return reply.status(201).send({
      success: true,
      message: translate(POSTS.SUCCESS.CREATED),
      data: post
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const limit = Math.min(parseInt(String(request.query.limit || 50)), 100);
    const skip = parseInt(String(request.query.skip || 0));
    const posts = await listPosts(limit, skip);

    return reply.send({
      success: true,
      data: posts,
      pagination: { limit, skip, total: posts.length }
    });
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const post = await getPostById(id);

    return reply.send({
      success: true,
      data: post
    });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = validateOrThrow(updatePostSchema, request.body);
    const post = await updatePost(id, data);

    return reply.send({
      success: true,
      message: translate(POSTS.SUCCESS.UPDATED),
      data: post
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await deletePost(id);

    return reply.send({
      success: true,
      message: translate(POSTS.SUCCESS.DELETED)
    });
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    const params = validateOrThrow(searchPostSchema, request.query);
    const limit = Math.min(parseInt(String(request.query.limit || 50)), 100);
    const posts = await searchPosts(params.q, limit);

    return reply.send({
      success: true,
      data: posts
    });
  }
}
