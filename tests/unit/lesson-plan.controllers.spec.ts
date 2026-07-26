import { FastifyReply, FastifyRequest } from 'fastify';
import { ROLES } from '@domain/user';
import { ALLOWED_GRADES, ALLOWED_SUBJECTS } from '@domain/lesson-plan';
import {
  deleteLessonPlan,
  generate,
  getById,
  list,
  save
} from '@infrastructure/http/controllers/lesson-plan';
import {
  makeDeleteLessonPlan,
  makeGenerateLessonPlan,
  makeGetLessonPlanById,
  makeListLessonPlans,
  makeSaveLessonPlan
} from '@infrastructure/http/factories/lesson-plan';

jest.mock('@infrastructure/http/factories/lesson-plan', () => ({
  makeGenerateLessonPlan: jest.fn(),
  makeSaveLessonPlan: jest.fn(),
  makeListLessonPlans: jest.fn(),
  makeGetLessonPlanById: jest.fn(),
  makeDeleteLessonPlan: jest.fn()
}));

const makeGenerateLessonPlanMock =
  makeGenerateLessonPlan as jest.MockedFunction<typeof makeGenerateLessonPlan>;
const makeSaveLessonPlanMock = makeSaveLessonPlan as jest.MockedFunction<
  typeof makeSaveLessonPlan
>;
const makeListLessonPlansMock = makeListLessonPlans as jest.MockedFunction<
  typeof makeListLessonPlans
>;
const makeGetLessonPlanByIdMock = makeGetLessonPlanById as jest.MockedFunction<
  typeof makeGetLessonPlanById
>;
const makeDeleteLessonPlanMock = makeDeleteLessonPlan as jest.MockedFunction<
  typeof makeDeleteLessonPlan
>;

function buildReply(): FastifyReply {
  return {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  } as unknown as FastifyReply;
}

function buildAuthedRequest(
  overrides: Partial<FastifyRequest> = {}
): FastifyRequest {
  return {
    user: {
      id: 'teacher-1',
      email: 'teacher@example.com',
      role: ROLES.TEACHER
    },
    ...overrides
  } as FastifyRequest;
}

const lessonPlanDto = {
  id: 'plan-1',
  subject: ALLOWED_SUBJECTS[0],
  grade: ALLOWED_GRADES[0],
  theme: 'Ciclo da água',
  objectives: ['Compreender o ciclo hidrológico'],
  content: '## Conteúdo',
  methodology: 'Aula dialogada',
  schedule: [{ duration: '10 min', description: 'Abertura' }],
  assessment: 'Observação formativa',
  resources: ['Quadro'],
  teacherId: 'teacher-1',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z')
};

function expectNoPrivateFields(value: unknown): void {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => expectNoPrivateFields(item));
    return;
  }

  for (const key of Object.keys(value as Record<string, unknown>)) {
    expect(key.startsWith('_')).toBe(false);
  }
}

describe('LessonPlan controllers HTTP contract', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('POST /lesson-plans/generate returns 200 with success envelope', async () => {
    makeGenerateLessonPlanMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(lessonPlanDto)
    } as unknown as ReturnType<typeof makeGenerateLessonPlan>);

    const reply = buildReply();
    await generate(
      buildAuthedRequest({
        body: {
          subject: ALLOWED_SUBJECTS[0],
          grade: ALLOWED_GRADES[0],
          theme: 'Ciclo da água'
        }
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(typeof payload.message).toBe('string');
    expect(payload.data.id).toBe('plan-1');
    expect(payload.data.grade).toBe(ALLOWED_GRADES[0]);
    expectNoPrivateFields(payload.data);
  });

  it('GET /lesson-plans returns 200 with data and pagination skeleton', async () => {
    makeListLessonPlansMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        lessonPlans: [lessonPlanDto],
        total: 1
      })
    } as unknown as ReturnType<typeof makeListLessonPlans>);

    const reply = buildReply();
    await list(
      buildAuthedRequest({
        query: {
          limit: '10',
          skip: '0',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          subject: ALLOWED_SUBJECTS[0]
        }
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload).toEqual({
      success: true,
      data: [
        expect.objectContaining({
          id: 'plan-1',
          subject: ALLOWED_SUBJECTS[0],
          grade: ALLOWED_GRADES[0]
        })
      ],
      pagination: {
        limit: 10,
        skip: 0,
        total: 1,
        hasMore: false,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        filters: {
          subject: ALLOWED_SUBJECTS[0],
          grade: undefined
        }
      }
    });
    expectNoPrivateFields(payload.data);
  });

  it('GET /lesson-plans/:id returns 200 with success envelope', async () => {
    makeGetLessonPlanByIdMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(lessonPlanDto)
    } as unknown as ReturnType<typeof makeGetLessonPlanById>);

    const reply = buildReply();
    await getById(
      buildAuthedRequest({
        params: { id: 'plan-1' }
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(payload.data.id).toBe('plan-1');
    expect(payload.message).toBeUndefined();
    expectNoPrivateFields(payload.data);
  });

  it('POST /lesson-plans returns 201 with success envelope', async () => {
    makeSaveLessonPlanMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(lessonPlanDto)
    } as unknown as ReturnType<typeof makeSaveLessonPlan>);

    const reply = buildReply();
    await save(
      buildAuthedRequest({
        body: {
          subject: ALLOWED_SUBJECTS[0],
          grade: ALLOWED_GRADES[0],
          theme: 'Ciclo da água',
          objectives: ['Objetivo'],
          content: 'Conteúdo',
          methodology: 'Metodologia',
          schedule: [{ duration: '10 min', description: 'Abertura' }],
          assessment: 'Avaliação',
          resources: ['Quadro']
        }
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(201);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload.success).toBe(true);
    expect(typeof payload.message).toBe('string');
    expect(payload.data.id).toBe('plan-1');
    expectNoPrivateFields(payload.data);
  });

  it('DELETE /lesson-plans/:id returns 200 with success and message only', async () => {
    makeDeleteLessonPlanMock.mockReturnValue({
      execute: jest.fn().mockResolvedValue(undefined)
    } as unknown as ReturnType<typeof makeDeleteLessonPlan>);

    const reply = buildReply();
    await deleteLessonPlan(
      buildAuthedRequest({
        params: { id: 'plan-1' }
      }),
      reply
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    const payload = (reply.send as jest.Mock).mock.calls[0][0];
    expect(payload).toEqual({
      success: true,
      message: expect.any(String)
    });
    expect(payload.data).toBeUndefined();
  });

  it('throws unauthorized when user is missing', async () => {
    const reply = buildReply();

    await expect(
      generate({ body: {} } as FastifyRequest, reply)
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
