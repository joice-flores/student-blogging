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
  }
};
