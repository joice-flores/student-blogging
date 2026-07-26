export const ENVIRONMENT = {
  MONGODB: {
    ERRORS: {
      URI: 'environment.mongodb.errors.mongoUri',
      CONNECTED: 'environment.mongodb.errors.connected'
    },
    SUCCESS: {
      CONNECTED: 'environment.mongodb.success.connected'
    }
  },
  GRAFANA: {
    ERRORS: {
      SERVER_ROOT_URL: 'environment.grafana.errors.serverRootUrl'
    }
  },
  ZOD: {
    ERRORS: {
      ENV_VARIABLES: 'environment.zod.errors.envVariables',
      CHECK_ENV_FILE: 'environment.zod.errors.checkEnvFile'
    },
    SUCCESS: {
      ENV_VALIDATED: 'environment.zod.success.envValidated'
    }
  }
} as const;

export const ERRORS = {
  INTERNAL: 'errors.internal',
  NOT_FOUND: 'errors.notFound',
  VALIDATION: 'errors.validation',
  BAD_REQUEST: 'errors.badRequest'
} as const;

export const POSTS = {
  ERRORS: {
    NOT_FOUND: 'posts.errors.notFound',
    TITLE_REQUIRED: 'posts.errors.titleRequired',
    CONTENT_REQUIRED: 'posts.errors.contentRequired',
    AUTHOR_REQUIRED: 'posts.errors.authorRequired',
    SEARCH_QUERY_REQUIRED: 'posts.errors.searchQueryRequired',
    VALIDATION: 'posts.errors.validation'
  },
  SUCCESS: {
    CREATED: 'posts.success.created',
    UPDATED: 'posts.success.updated',
    DELETED: 'posts.success.deleted'
  }
} as const;

export const USERS = {
  ERRORS: {
    EMAIL_ALREADY_IN_USE: 'users.errors.emailAlreadyInUse',
    INVALID_CREDENTIALS: 'users.errors.invalidCredentials',
    INVALID_EMAIL: 'users.errors.invalidEmail',
    INVALID_ROLE: 'users.errors.invalidRole',
    FORBIDDEN: 'users.errors.forbidden',
    NOT_FOUND: 'users.errors.notFound',
    UNAUTHORIZED: 'users.errors.unauthorized'
  },
  SUCCESS: {
    UPDATED: 'users.success.updated',
    DELETED: 'users.success.deleted'
  }
} as const;

export const LESSON_PLANS = {
  ERRORS: {
    INVALID_SUBJECT: 'lessonPlans.errors.invalidSubject',
    INVALID_GRADE: 'lessonPlans.errors.invalidGrade',
    INVALID_THEME: 'lessonPlans.errors.invalidTheme',
    INVALID_SCHEDULE_STEP: 'lessonPlans.errors.invalidScheduleStep',
    NOT_FOUND: 'lessonPlans.errors.notFound',
    FORBIDDEN: 'lessonPlans.errors.forbidden',
    CONFLICT: 'lessonPlans.errors.conflict',
    AI_PROVIDER_UNAVAILABLE: 'lessonPlans.errors.aiProviderUnavailable'
  },
  SUCCESS: {
    GENERATED: 'lessonPlans.success.generated',
    SAVED: 'lessonPlans.success.saved',
    DELETED: 'lessonPlans.success.deleted'
  }
} as const;
