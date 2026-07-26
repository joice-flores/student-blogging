import { StubLessonPlanProvider } from '@infrastructure/providers/ai';
import { ALLOWED_GRADES, ALLOWED_SUBJECTS } from '@domain/lesson-plan';

describe('StubLessonPlanProvider', () => {
  const provider = new StubLessonPlanProvider();

  it('generates pedagogical sections from subject, grade and theme', async () => {
    const result = await provider.generate({
      subject: ALLOWED_SUBJECTS[0],
      grade: ALLOWED_GRADES[0],
      theme: 'Ciclo da água'
    });

    expect(result.objectives.length).toBeGreaterThan(0);
    expect(result.content).toContain('Ciclo da água');
    expect(result.content).toContain(ALLOWED_SUBJECTS[0]);
    expect(result.methodology.trim().length).toBeGreaterThan(0);
    expect(result.schedule.length).toBeGreaterThan(0);
    expect(result.schedule[0]).toEqual(
      expect.objectContaining({
        duration: expect.any(String),
        description: expect.any(String)
      })
    );
    expect(result.assessment.trim().length).toBeGreaterThan(0);
    expect(result.resources.length).toBeGreaterThan(0);
  });

  it('keeps prompt/parse isolated inside the adapter contract', async () => {
    const result = await provider.generate({
      subject: ALLOWED_SUBJECTS[1],
      grade: ALLOWED_GRADES[9],
      theme: 'Frações equivalentes'
    });

    expect(result).toEqual({
      objectives: expect.any(Array),
      content: expect.any(String),
      methodology: expect.any(String),
      schedule: expect.any(Array),
      assessment: expect.any(String),
      resources: expect.any(Array)
    });
    expect(result.objectives[0]).toContain('Frações equivalentes');
    expect(result.content).toContain(ALLOWED_GRADES[9]);
  });
});
