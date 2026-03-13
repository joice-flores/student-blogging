import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListPosts } from '@infrastructure/http/factories/post';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { limit?: string; skip?: string };
  const limit = Math.min(parseInt(String(query.limit || 50)), 100);
  const skip = parseInt(String(query.skip || 0));
  const posts = await makeListPosts().execute({ limit, skip });

  return reply.send({
    success: true,
    data: posts,
    pagination: { limit, skip, total: posts.length }
  });
}
