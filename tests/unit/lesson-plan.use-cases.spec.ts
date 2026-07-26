import {
  DeleteLessonPlan,
  GenerateLessonPlan,
  GetLessonPlanById,
  ListLessonPlans,
  SaveLessonPlan
} from '@application/lesson-plan';
import { AiLessonPlanProvider } from '@application/providers/ai-lesson-plan-provider';
import {
  ALLOWED_GRADES,
  ALLOWED_SUBJECTS,
  Grade,
  ILessonPlanRepository,
  LessonPlan,
  LessonPlanId,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';
import { ROLES } from '@domain/user';

function createLessonPlan(teacherId: string, id = 'plan-1'): LessonPlan {
  return LessonPlan.create({
    id: LessonPlanId.create(id),
    subject: Subject.create(ALLOWED_SUBJECTS[0]),
    grade: Grade.create(ALLOWED_GRADES[0]),
    theme: Theme.create('Ciclo da água'),
    objectives: ['Compreender o ciclo hidrológico'],
    content: '## Conteúdo',
    methodology: 'Aula dialogada',
    schedule: [
      ScheduleStep.create({
        duration: '10 min',
        description: 'Abertura'
      })
    ],
    assessment: 'Observação formativa',
    resources: ['Quadro'],
    teacherId
  });
}

describe('LessonPlan Use Cases', () => {
  let lessonPlanRepository: jest.Mocked<ILessonPlanRepository>;
  let aiLessonPlanProvider: jest.Mocked<AiLessonPlanProvider>;

  beforeEach(() => {
    lessonPlanRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTeacherId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn()
    };

    aiLessonPlanProvider = {
      generate: jest.fn()
    };
  });

  describe('GenerateLessonPlan', () => {
    it('generates a draft lesson plan via AI provider without persisting', async () => {
      aiLessonPlanProvider.generate.mockResolvedValue({
        objectives: ['Objetivo 1'],
        content: 'Conteúdo gerado',
        methodology: 'Metodologia',
        schedule: [{ duration: '15 min', description: 'Desenvolvimento' }],
        assessment: 'Avaliação',
        resources: ['Livro']
      });

      const useCase = new GenerateLessonPlan(aiLessonPlanProvider);
      const result = await useCase.execute({
        subject: ALLOWED_SUBJECTS[0],
        grade: ALLOWED_GRADES[0],
        theme: 'Frações',
        teacherId: 'teacher-1'
      });

      expect(aiLessonPlanProvider.generate).toHaveBeenCalledWith({
        subject: ALLOWED_SUBJECTS[0],
        grade: ALLOWED_GRADES[0],
        theme: 'Frações'
      });
      expect(lessonPlanRepository.create).not.toHaveBeenCalled();
      expect(result.teacherId).toBe('teacher-1');
      expect(result.subject).toBe(ALLOWED_SUBJECTS[0]);
      expect(result.grade).toBe(ALLOWED_GRADES[0]);
      expect(result.theme).toBe('Frações');
      expect(result.objectives).toEqual(['Objetivo 1']);
      expect(result.id).toBeDefined();
    });
  });

  describe('SaveLessonPlan', () => {
    it('persists a lesson plan owned by the authenticated teacher', async () => {
      lessonPlanRepository.create.mockResolvedValue(undefined);

      const useCase = new SaveLessonPlan(lessonPlanRepository);
      const result = await useCase.execute({
        subject: ALLOWED_SUBJECTS[1],
        grade: ALLOWED_GRADES[1],
        theme: 'Revolução Industrial',
        objectives: ['Entender causas e consequências'],
        content: '## Conteúdo',
        methodology: 'Estudo de caso',
        schedule: [{ duration: '20 min', description: 'Leitura' }],
        assessment: 'Debate',
        resources: ['Textos'],
        teacherId: 'teacher-1'
      });

      expect(lessonPlanRepository.create).toHaveBeenCalledTimes(1);
      const saved = lessonPlanRepository.create.mock.calls[0][0] as LessonPlan;
      expect(saved.teacherId).toBe('teacher-1');
      expect(result.teacherId).toBe('teacher-1');
      expect(result.theme).toBe('Revolução Industrial');
    });
  });

  describe('ListLessonPlans', () => {
    it('lists only own plans for teacher', async () => {
      const ownPlan = createLessonPlan('teacher-1');
      lessonPlanRepository.findByTeacherId.mockResolvedValue({
        lessonPlans: [ownPlan],
        total: 1
      });

      const useCase = new ListLessonPlans(lessonPlanRepository);
      const result = await useCase.execute({
        teacherId: 'teacher-1',
        requesterRole: ROLES.TEACHER,
        limit: 10,
        skip: 0
      });

      expect(lessonPlanRepository.findByTeacherId).toHaveBeenCalledWith(
        'teacher-1',
        { limit: 10, skip: 0 }
      );
      expect(lessonPlanRepository.findAll).not.toHaveBeenCalled();
      expect(result.total).toBe(1);
      expect(result.lessonPlans[0].teacherId).toBe('teacher-1');
    });

    it('lists all plans for admin', async () => {
      const plans = [
        createLessonPlan('teacher-1', 'plan-1'),
        createLessonPlan('teacher-2', 'plan-2')
      ];
      lessonPlanRepository.findAll.mockResolvedValue({
        lessonPlans: plans,
        total: 2
      });

      const useCase = new ListLessonPlans(lessonPlanRepository);
      const result = await useCase.execute({
        teacherId: 'admin-1',
        requesterRole: ROLES.ADMIN,
        limit: 20,
        skip: 0
      });

      expect(lessonPlanRepository.findAll).toHaveBeenCalledWith({
        limit: 20,
        skip: 0
      });
      expect(lessonPlanRepository.findByTeacherId).not.toHaveBeenCalled();
      expect(result.total).toBe(2);
      expect(result.lessonPlans).toHaveLength(2);
    });
  });

  describe('GetLessonPlanById', () => {
    it('returns plan for owner teacher', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);

      const useCase = new GetLessonPlanById(lessonPlanRepository);
      const result = await useCase.execute({
        id: plan.id.toString(),
        teacherId: 'teacher-1',
        requesterRole: ROLES.TEACHER
      });

      expect(result.id).toBe(plan.id.toString());
      expect(result.teacherId).toBe('teacher-1');
    });

    it('returns plan for admin even when not owner', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);

      const useCase = new GetLessonPlanById(lessonPlanRepository);
      const result = await useCase.execute({
        id: plan.id.toString(),
        teacherId: 'admin-1',
        requesterRole: ROLES.ADMIN
      });

      expect(result.teacherId).toBe('teacher-1');
    });

    it('forbids teacher from accessing another teacher plan', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);

      const useCase = new GetLessonPlanById(lessonPlanRepository);

      await expect(
        useCase.execute({
          id: plan.id.toString(),
          teacherId: 'teacher-2',
          requesterRole: ROLES.TEACHER
        })
      ).rejects.toMatchObject({ statusCode: 403 });
    });

    it('throws not found when plan does not exist', async () => {
      lessonPlanRepository.findById.mockResolvedValue(null);

      const useCase = new GetLessonPlanById(lessonPlanRepository);

      await expect(
        useCase.execute({
          id: 'missing',
          teacherId: 'teacher-1',
          requesterRole: ROLES.TEACHER
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('DeleteLessonPlan', () => {
    it('deletes own plan for teacher', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);
      lessonPlanRepository.delete.mockResolvedValue(true);

      const useCase = new DeleteLessonPlan(lessonPlanRepository);
      await useCase.execute({
        id: plan.id.toString(),
        teacherId: 'teacher-1',
        requesterRole: ROLES.TEACHER
      });

      expect(lessonPlanRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('allows admin to delete any plan', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);
      lessonPlanRepository.delete.mockResolvedValue(true);

      const useCase = new DeleteLessonPlan(lessonPlanRepository);
      await useCase.execute({
        id: plan.id.toString(),
        teacherId: 'admin-1',
        requesterRole: ROLES.ADMIN
      });

      expect(lessonPlanRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('forbids teacher from deleting another teacher plan', async () => {
      const plan = createLessonPlan('teacher-1');
      lessonPlanRepository.findById.mockResolvedValue(plan);

      const useCase = new DeleteLessonPlan(lessonPlanRepository);

      await expect(
        useCase.execute({
          id: plan.id.toString(),
          teacherId: 'teacher-2',
          requesterRole: ROLES.TEACHER
        })
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(lessonPlanRepository.delete).not.toHaveBeenCalled();
    });
  });
});
