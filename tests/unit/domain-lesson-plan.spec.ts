import {
  ALLOWED_GRADES,
  ALLOWED_SUBJECTS,
  Grade,
  LessonPlan,
  LessonPlanId,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';

const validProps = () => ({
  subject: Subject.create(ALLOWED_SUBJECTS[0]),
  grade: Grade.create(ALLOWED_GRADES[0]),
  theme: Theme.create('Ciclo da água'),
  objectives: ['Compreender o ciclo da água'],
  content: '## Introdução\n\nConteúdo da aula',
  methodology: 'Aula expositiva dialogada',
  schedule: [
    ScheduleStep.create({
      duration: '10 min',
      description: 'Abertura'
    })
  ],
  assessment: 'Observação participativa',
  resources: ['Quadro', 'Projetor'],
  teacherId: 'teacher-1'
});

describe('LessonPlan domain', () => {
  it('creates a lesson plan with metadata, sections and ownership', () => {
    const id = LessonPlanId.create('plan-1');
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const updatedAt = new Date('2024-01-02T00:00:00Z');

    const lessonPlan = LessonPlan.create({
      ...validProps(),
      id,
      createdAt,
      updatedAt
    });

    expect(lessonPlan.id.equals(id)).toBe(true);
    expect(lessonPlan.subject.getValue()).toBe(ALLOWED_SUBJECTS[0]);
    expect(lessonPlan.grade.getValue()).toBe(ALLOWED_GRADES[0]);
    expect(lessonPlan.theme.getValue()).toBe('Ciclo da água');
    expect(lessonPlan.objectives).toEqual(['Compreender o ciclo da água']);
    expect(lessonPlan.content).toContain('Introdução');
    expect(lessonPlan.methodology).toBe('Aula expositiva dialogada');
    expect(lessonPlan.schedule).toHaveLength(1);
    expect(lessonPlan.assessment).toBe('Observação participativa');
    expect(lessonPlan.resources).toEqual(['Quadro', 'Projetor']);
    expect(lessonPlan.teacherId).toBe('teacher-1');
    expect(lessonPlan.belongsToTeacher('teacher-1')).toBe(true);
    expect(lessonPlan.belongsToTeacher('teacher-2')).toBe(false);
    expect(lessonPlan.createdAt).toBe(createdAt);
    expect(lessonPlan.updatedAt).toBe(updatedAt);
  });

  it('trims pedagogical fields and teacherId', () => {
    const lessonPlan = LessonPlan.create({
      ...validProps(),
      objectives: ['  Objetivo  '],
      content: '  Conteúdo  ',
      methodology: '  Metodologia  ',
      assessment: '  Avaliação  ',
      resources: ['  Livro  ', ' '],
      teacherId: '  teacher-1  '
    });

    expect(lessonPlan.objectives).toEqual(['Objetivo']);
    expect(lessonPlan.content).toBe('Conteúdo');
    expect(lessonPlan.methodology).toBe('Metodologia');
    expect(lessonPlan.assessment).toBe('Avaliação');
    expect(lessonPlan.resources).toEqual(['Livro']);
    expect(lessonPlan.teacherId).toBe('teacher-1');
  });

  it('throws when teacherId is empty', () => {
    expect(() =>
      LessonPlan.create({
        ...validProps(),
        teacherId: '   '
      })
    ).toThrow();
  });

  it('throws when pedagogical sections are incomplete', () => {
    expect(() =>
      LessonPlan.create({
        ...validProps(),
        objectives: []
      })
    ).toThrow();

    expect(() =>
      LessonPlan.create({
        ...validProps(),
        content: ' '
      })
    ).toThrow();

    expect(() =>
      LessonPlan.create({
        ...validProps(),
        methodology: ''
      })
    ).toThrow();

    expect(() =>
      LessonPlan.create({
        ...validProps(),
        schedule: []
      })
    ).toThrow();

    expect(() =>
      LessonPlan.create({
        ...validProps(),
        assessment: ' '
      })
    ).toThrow();

    expect(() =>
      LessonPlan.create({
        ...validProps(),
        resources: [' ', '']
      })
    ).toThrow();
  });

  it('reconstitutes a lesson plan preserving identity', () => {
    const id = LessonPlanId.create('plan-2');
    const lessonPlan = LessonPlan.reconstitute({
      ...validProps(),
      id
    });

    expect(lessonPlan.id.toString()).toBe('plan-2');
  });
});

describe('Subject value object', () => {
  it('accepts allowed subjects and compares values', () => {
    const subject = Subject.create(`  ${ALLOWED_SUBJECTS[1]}  `);
    const same = Subject.create(ALLOWED_SUBJECTS[1]);
    const other = Subject.create(ALLOWED_SUBJECTS[2]);

    expect(subject.getValue()).toBe(ALLOWED_SUBJECTS[1]);
    expect(subject.equals(same)).toBe(true);
    expect(subject.equals(other)).toBe(false);
  });

  it('throws for invalid subject', () => {
    expect(() => Subject.create('Astronomia')).toThrow();
  });
});

describe('Grade value object', () => {
  it('accepts allowed grades and uses canonical grade term', () => {
    const grade = Grade.create(`  ${ALLOWED_GRADES[9]}  `);
    const same = Grade.create(ALLOWED_GRADES[9]);

    expect(grade.getValue()).toBe(ALLOWED_GRADES[9]);
    expect(grade.equals(same)).toBe(true);
  });

  it('throws for invalid grade', () => {
    expect(() => Grade.create('Pré-escola')).toThrow();
  });
});

describe('Theme value object', () => {
  it('requires at least 3 characters after trim', () => {
    const theme = Theme.create('  AB C  ');

    expect(theme.getValue()).toBe('AB C');
    expect(() => Theme.create('ab')).toThrow();
    expect(() => Theme.create('  a  ')).toThrow();
  });
});

describe('ScheduleStep value object', () => {
  it('requires duration and description', () => {
    const step = ScheduleStep.create({
      duration: ' 15 min ',
      description: ' Desenvolvimento '
    });

    expect(step.toObject()).toEqual({
      duration: '15 min',
      description: 'Desenvolvimento'
    });
    expect(() =>
      ScheduleStep.create({ duration: ' ', description: 'Etapa' })
    ).toThrow();
    expect(() =>
      ScheduleStep.create({ duration: '10 min', description: ' ' })
    ).toThrow();
  });
});

describe('LessonPlanId value object', () => {
  it('compares and returns values', () => {
    const first = LessonPlanId.create('plan-1');
    const same = LessonPlanId.create('plan-1');
    const other = LessonPlanId.create('plan-2');

    expect(first.toString()).toBe('plan-1');
    expect(first.equals(same)).toBe(true);
    expect(first.equals(other)).toBe(false);
  });
});
