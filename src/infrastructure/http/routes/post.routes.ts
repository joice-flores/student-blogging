import { FastifyInstance } from 'fastify';
import { PostController } from '@infrastructure/http/controllers/post/post.controller';

const postController = new PostController();

export async function postRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) =>
    postController.list(request, reply)
  );
  fastify.get('/search', async (request, reply) =>
    postController.search(request, reply)
  );
  fastify.get('/:id', async (request, reply) =>
    postController.getById(request, reply)
  );
  fastify.post('/', async (request, reply) =>
    postController.create(request, reply)
  );
  fastify.put('/:id', async (request, reply) =>
    postController.update(request, reply)
  );
  fastify.delete('/:id', async (request, reply) =>
    postController.delete(request, reply)
  );
}
