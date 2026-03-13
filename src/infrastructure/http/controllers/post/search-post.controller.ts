import { FastifyRequest, FastifyReply } from 'fastify';
import { makeSearchPosts } from '@infrastructure/http/factories/post';
import { searchPostSchema } from '@infrastructure/http/controllers/post/post.validation';
import { validateOrThrow } from '@shared/utils/validation';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const params = validateOrThrow(searchPostSchema, request.query);
  const posts = await makeSearchPosts().execute({ query: params.q });

  return reply.send({
    success: true,
    data: posts
  });
}
