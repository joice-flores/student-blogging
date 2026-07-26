import { environment } from '@shared/i18n/locales/environment';

export const ptBR = {
  environment,
  errors: {
    internal: 'Erro interno do servidor',
    notFound: 'Recurso não encontrado',
    validation: 'Erro de validação',
    badRequest: 'Requisição inválida',
    unauthorized: 'Não autorizado'
  },
  posts: {
    errors: {
      notFound: 'Post não encontrado',
      titleRequired: 'Título é obrigatório',
      contentRequired: 'Conteúdo é obrigatório',
      authorRequired: 'Autor é obrigatório',
      searchQueryRequired: 'Parâmetro de busca é obrigatório',
      validation: 'Erro de validação dos dados'
    },
    success: {
      created: 'Post criado com sucesso',
      updated: 'Post atualizado com sucesso',
      deleted: 'Post removido com sucesso'
    }
  },
  users: {
    errors: {
      emailAlreadyInUse: 'E-mail já está em uso',
      forbidden: 'Você não tem permissão para executar esta ação',
      invalidCredentials: 'E-mail ou senha inválidos',
      invalidEmail: 'E-mail inválido',
      invalidRole: 'Perfil inválido',
      notFound: 'Usuário não encontrado',
      unauthorized: 'Usuário não autorizado'
    },
    success: {
      updated: 'Usuário atualizado com sucesso',
      deleted: 'Usuário removido com sucesso'
    }
  },
  lessonPlans: {
    errors: {
      invalidSubject: 'Disciplina inválida',
      invalidGrade: 'Série/ano inválido',
      invalidTheme: 'Tema deve ter pelo menos 3 caracteres',
      invalidScheduleStep: 'Etapa de cronograma inválida',
      invalidTeacherId: 'ID do professor é obrigatório',
      invalidObjectives: 'Pelo menos um objetivo de aprendizagem é obrigatório',
      invalidContent: 'Conteúdo da aula é obrigatório',
      invalidMethodology: 'Metodologia é obrigatória',
      invalidSchedule: 'Pelo menos uma etapa do cronograma é obrigatória',
      invalidAssessment: 'Avaliação é obrigatória',
      invalidResources: 'Pelo menos um recurso é obrigatório',
      notFound: 'Plano de aula não encontrado',
      forbidden: 'Você não tem permissão para acessar este plano de aula',
      conflict: 'Conflito de plano de aula',
      aiProviderUnavailable: 'Provedor de IA indisponível'
    },
    success: {
      generated: 'Plano de aula gerado com sucesso',
      saved: 'Plano de aula salvo com sucesso',
      deleted: 'Plano de aula removido com sucesso'
    }
  }
};
