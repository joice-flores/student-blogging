import { ErrorBuilder, Codes, AppError } from '@shared/errors/builder';
import { POSTS } from '@shared/constants/i18n.keys';

export class PostError extends ErrorBuilder {
  static postNotFound(id?: string): AppError {
    return this.create()
      .withI18nKey(POSTS.ERRORS.NOT_FOUND)
      .withStatusCode(404)
      .withCode(Codes.NOT_FOUND)
      .withDetails({ postId: id })
      .build();
  }
}
