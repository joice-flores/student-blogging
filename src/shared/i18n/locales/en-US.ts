import { environment } from '@shared/i18n/locales/environment';

export const enUS = {
  environment,
  errors: {
    internal: 'Internal server error',
    notFound: 'Resource not found',
    validation: 'Validation error',
    badRequest: 'Bad request'
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
  }
};
