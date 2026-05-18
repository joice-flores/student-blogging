import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetPostById } from '@infrastructure/http/factories/post';
import { PostPresenter } from '@infrastructure/http/presenters';

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const post = await makeGetPostById().execute({ id });

  return reply.send({
    success: true,
    data: PostPresenter.toHTTP(post)
  });
}
