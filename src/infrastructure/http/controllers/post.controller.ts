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
} from '@application/use-cases/post.use-cases';
import {
  createPostSchema,
  updatePostSchema,
  searchPostSchema
} from '@application/dtos/post.validation';

export class PostController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const validated = createPostSchema.safeParse(request.body);

    if (!validated.success) {
      return this.handleError(validated.error, reply);
    }

    const post = await createPost(validated.data);

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
    const validated = updatePostSchema.safeParse(request.body);

    if (!validated.success) {
      return this.handleError(validated.error, reply);
    }

    const post = await updatePost(id, validated.data);

    return reply.send({
      success: true,
      message: translate(POSTS.SUCCESS.UPDATED),
      data: post
    });
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await deletePost(id);

    return reply.status(204).send();
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    const validated = searchPostSchema.safeParse(request.query);

    if (!validated.success) {
      return this.handleError(validated.error, reply);
    }

    const limit = Math.min(parseInt(String(request.query.limit || 50)), 100);
    const posts = await searchPosts(validated.data.q, limit);

    return reply.send({
      success: true,
      data: posts
    });
  }

  private handleError(error: unknown, reply: FastifyReply) {
    const err = error as any;

    if (err.errors) {
      return reply.status(400).send({
        success: false,
        message: 'translate(POSTS.ERRORS.VALIDATION)',
        errors: err.errors
      });
    }

    if (err.message?.includes('not found')) {
      return reply.status(404).send({
        success: false,
        message: err.message
      });
    }

    if (err.message?.includes('required')) {
      return reply.status(400).send({
        success: false,
        message: err.message
      });
    }

    return reply.status(500).send({
      success: false,
      message: translate(POSTS.ERRORS.VALIDATION),
      description: error?.flatten().fieldErrors
    });
  }
}
