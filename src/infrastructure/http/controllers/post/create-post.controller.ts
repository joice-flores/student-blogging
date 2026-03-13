import { FastifyRequest, FastifyReply } from 'fastify';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { makeCreatePost } from '@infrastructure/http/factories/post';
import { createPostSchema } from '@infrastructure/http/controllers/post/post.validation';
import { validateOrThrow } from '@shared/utils/validation';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = validateOrThrow(createPostSchema, request.body);
  const post = await makeCreatePost().execute(data);

  return reply.status(201).send({
    success: true,
    message: translate(POSTS.SUCCESS.CREATED),
    data: post
  });
}
