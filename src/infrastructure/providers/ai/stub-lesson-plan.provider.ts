import { AiLessonPlanProvider } from '@application/providers/ai-lesson-plan-provider';
import { LessonPlanSectionsDto } from '@application/lesson-plan/dto/lesson-plan.dto';

export class StubLessonPlanProvider implements AiLessonPlanProvider {
  async generate(input: {
    subject: string;
    grade: string;
    theme: string;
  }): Promise<LessonPlanSectionsDto> {
    return {
      objectives: [
        `Compreender o tema "${input.theme}" no contexto de ${input.subject}`,
        `Aplicar conceitos de ${input.subject} adequados ao ${input.grade}`
      ],
      content: `## Introdução\n\nPlano stub para **${input.theme}** (${input.subject} — ${input.grade}).\n\n## Tópicos\n\n- Conceitos fundamentais\n- Exemplos práticos\n- Síntese`,
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
      resources: [
        'Quadro branco',
        'Projetor',
        'Material impresso de apoio'
      ]
    };
  }
}
