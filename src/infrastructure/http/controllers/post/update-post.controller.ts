import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { makeUpdatePost } from '@infrastructure/http/factories/post';
import { updatePostSchema } from '@infrastructure/http/controllers/post/post.validation';
import { validateOrThrow } from '@shared/utils/validation';
import { PostPresenter } from '@infrastructure/http/presenters';

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const data = validateOrThrow(updatePostSchema, request.body);
  const post = await makeUpdatePost().execute({ id, ...data });

  return reply.send({
    success: true,
    message: translate(POSTS.SUCCESS.UPDATED),
    data: PostPresenter.toHTTP(post)
  });
}
