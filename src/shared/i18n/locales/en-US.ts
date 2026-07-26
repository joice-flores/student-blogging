import { environment } from '@shared/i18n/locales/environment';

export const enUS = {
  environment,
  errors: {
    internal: 'Internal server error',
    notFound: 'Resource not found',
    validation: 'Validation error',
    badRequest: 'Bad request',
    unauthorized: 'Unauthorized'
  },
  posts: {
    errors: {
      notFound: 'Post not found',
      titleRequired: 'Title is required',
      contentRequired: 'Content is required',
      authorRequired: 'Author is required',
      searchQueryRequired: 'Search query parameter is required',
      validation: 'Data validation error'
    },
    success: {
      created: 'Post created successfully',
      updated: 'Post updated successfully',
      deleted: 'Post deleted successfully'
    }
  },
  users: {
    errors: {
      emailAlreadyInUse: 'Email is already in use',
      forbidden: 'You do not have permission to perform this action',
      invalidCredentials: 'Invalid email or password',
      invalidEmail: 'Invalid email',
      invalidRole: 'Invalid role',
      notFound: 'User not found',
      unauthorized: 'User Unauthorized'
    },
    success: {
      updated: 'User updated successfully',
      deleted: 'User deleted successfully'
    }
  },
  lessonPlans: {
    errors: {
      invalidSubject: 'Invalid subject',
      invalidGrade: 'Invalid grade',
      invalidTheme: 'Theme must have at least 3 characters',
      invalidScheduleStep: 'Invalid schedule step',
      notFound: 'Lesson plan not found',
      forbidden: 'You do not have permission to access this lesson plan',
      conflict: 'Lesson plan conflict',
      aiProviderUnavailable: 'AI provider is unavailable'
    },
    success: {
      generated: 'Lesson plan generated successfully',
      saved: 'Lesson plan saved successfully',
      deleted: 'Lesson plan deleted successfully'
    }
  }
};
