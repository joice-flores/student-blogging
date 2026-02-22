import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { makeDeletePost } from '@infrastructure/http/factories/post';

export async function deletePost(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await makeDeletePost().execute({ id });

  return reply.send({
    success: true,
    message: translate(POSTS.SUCCESS.DELETED)
  });
}
