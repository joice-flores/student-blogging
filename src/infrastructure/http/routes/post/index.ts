import { FastifyInstance } from 'fastify';
import {
  create,
  deletePost,
  getById,
  list,
  search,
  update
} from '@infrastructure/http/controllers/post';

export async function postRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => create(request, reply));
  fastify.delete('/:id', async (request, reply) => deletePost(request, reply));
  fastify.get('/:id', async (request, reply) => getById(request, reply));
  fastify.get('/', async (request, reply) => list(request, reply));
  fastify.get('/search', async (request, reply) => search(request, reply));
  fastify.put('/:id', async (request, reply) => update(request, reply));
}
