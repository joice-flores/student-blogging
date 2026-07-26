import {
  AiLessonPlanProvider,
  GenerateLessonPlanInput
} from '@application/providers/ai-lesson-plan-provider';
import { LessonPlanSectionsDto } from '@application/lesson-plan/dto/lesson-plan.dto';
import { AppError } from '@shared/errors/builder';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

type StubModelResponse = {
  readonly objectives: readonly string[];
  readonly content: string;
  readonly methodology: string;
  readonly schedule: readonly {
    readonly duration: string;
    readonly description: string;
  }[];
  readonly assessment: string;
  readonly resources: readonly string[];
};

export class StubLessonPlanProvider implements AiLessonPlanProvider {
  async generate(
    input: GenerateLessonPlanInput
  ): Promise<LessonPlanSectionsDto> {
    const prompt = this.buildPrompt(input);
    const rawResponse = this.invokeStubModel(prompt, input);
    return this.parseResponse(rawResponse);
  }

  private buildPrompt(input: GenerateLessonPlanInput): string {
    return [
      'Gere um plano de aula estruturado em JSON com as chaves:',
      'objectives, content, methodology, schedule, assessment, resources.',
      `Disciplina: ${input.subject}`,
      `Ano/série (grade): ${input.grade}`,
      `Tema: ${input.theme}`
    ].join('\n');
  }

  private invokeStubModel(
    _prompt: string,
    input: GenerateLessonPlanInput
  ): string {
    const payload: StubModelResponse = {
      objectives: [
        `Compreender o tema "${input.theme}" no contexto de ${input.subject}`,
        `Aplicar conceitos de ${input.subject} adequados ao ${input.grade}`
      ],
      content: [
        `## Introdução`,
        ``,
        `Plano stub para **${input.theme}** (${input.subject} — ${input.grade}).`,
        ``,
        `## Tópicos`,
        ``,
        `- Conceitos fundamentais`,
        `- Exemplos práticos`,
        `- Síntese`
      ].join('\n'),
      methodology:
        'Aula expositiva dialogada com atividade em grupo e socialização das conclusões.',
      schedule: [
        {
          duration: '10 min',
          description: 'Aquecimento e levantamento de conhecimentos prévios'
        },
        {
          duration: '25 min',
          description: 'Desenvolvimento do conteúdo e exemplos'
        },
        {
          duration: '10 min',
          description: 'Atividade prática em duplas'
        },
        {
          duration: '5 min',
          description: 'Fechamento e dúvidas'
        }
      ],
      assessment:
        'Observação formativa durante a atividade e pergunta de saída oral.',
      resources: ['Quadro branco', 'Projetor', 'Material impresso de apoio']
    };

    return JSON.stringify(payload);
  }

  private parseResponse(rawResponse: string): LessonPlanSectionsDto {
    try {
      const parsed = JSON.parse(rawResponse) as StubModelResponse;

      if (!this.isValidResponse(parsed)) {
        throw LessonPlanError.aiProviderUnavailable();
      }

      return {
        objectives: [...parsed.objectives],
        content: parsed.content,
        methodology: parsed.methodology,
        schedule: parsed.schedule.map(step => ({
          duration: step.duration,
          description: step.description
        })),
        assessment: parsed.assessment,
        resources: [...parsed.resources]
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw LessonPlanError.aiProviderUnavailable();
    }
  }

  private isValidResponse(value: StubModelResponse): boolean {
    return [
      Array.isArray(value.objectives),
      value.objectives.length > 0,
      typeof value.content === 'string',
      value.content.trim().length > 0,
      typeof value.methodology === 'string',
      value.methodology.trim().length > 0,
      Array.isArray(value.schedule),
      value.schedule.length > 0,
      typeof value.assessment === 'string',
      value.assessment.trim().length > 0,
      Array.isArray(value.resources),
      value.resources.length > 0
    ].every(Boolean);
  }
}
