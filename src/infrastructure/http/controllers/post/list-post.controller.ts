import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListPosts } from '@infrastructure/http/factories/post';
import { ListPostsDto } from '@application/post/dto/post.dto';
import { PostPresenter } from '@infrastructure/http/presenters';

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { limit?: string; skip?: string };
  const limit = Math.min(parseInt(String(query.limit || 50)), 100);
  const skip = parseInt(String(query.skip || 0));
  const { posts, total } = await makeListPosts().execute({
    limit,
    skip
  } as ListPostsDto);

  return reply.send({
    success: true,
    data: PostPresenter.toHTTPList(posts),
    pagination: {
      limit,
      skip,
      total,
      hasMore: skip + limit < total
    }
  });
}
