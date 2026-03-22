import { FastifyInstance } from 'fastify';
import {
  create,
  deletePost,
  getById,
  list,
  search,
  update
} from '@infrastructure/http/controllers/post';
import { makeAuthMiddleware } from '@infrastructure/http/middlewares/auth.middleware';

export async function postRoutes(fastify: FastifyInstance) {
  const authMiddleware = makeAuthMiddleware();

  fastify.get('/:id', async (request, reply) => getById(request, reply));
  fastify.get('/', async (request, reply) => list(request, reply));
  fastify.get('/search', async (request, reply) => search(request, reply));

  fastify.register(async protectedRoutes => {
    protectedRoutes.addHook('onRequest', authMiddleware);

    protectedRoutes.post('/', async (request, reply) => create(request, reply));
    protectedRoutes.delete('/:id', async (request, reply) =>
      deletePost(request, reply)
    );
    protectedRoutes.put('/:id', async (request, reply) =>
      update(request, reply)
    );
  });
}
