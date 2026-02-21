import { ErrorBuilder, Codes, AppError } from '@shared/errors/builder';

export class PostError extends ErrorBuilder {
  static postNotFound(id?: string): AppError {
    return ErrorBuilder.create()
      .withI18nKey('posts.errors.notFound')
      .withStatusCode(404)
      .withCode(Codes.NOT_FOUND)
      .withDetails({ postId: id })
      .build();
  }
}
