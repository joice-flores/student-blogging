import { ErrorBuilder, Codes, AppError } from '@shared/errors/builder';
import { USERS } from '@shared/constants/i18n.keys';

export class UserError extends ErrorBuilder {
  static emailAlreadyInUse(): AppError {
    return this.create()
      .withI18nKey(USERS.ERRORS.EMAIL_ALREADY_IN_USE)
      .withStatusCode(409)
      .withCode(Codes.BAD_REQUEST)
      .build();
  }

  static invalidCredentials(): AppError {
    return this.create()
      .withI18nKey(USERS.ERRORS.INVALID_CREDENTIALS)
      .withStatusCode(401)
      .withCode(Codes.UNAUTHORIZED)
      .build();
  }

  static invalidEmail(): AppError {
    return this.create()
      .withI18nKey(USERS.ERRORS.INVALID_EMAIL)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .build();
  }

  static notFound(): AppError {
    return this.create()
      .withI18nKey(USERS.ERRORS.NOT_FOUND)
      .withStatusCode(404)
      .withCode(Codes.NOT_FOUND)
      .build();
  }

  static unauthorized(): AppError {
    return this.create()
      .withI18nKey(USERS.ERRORS.UNAUTHORIZED)
      .withStatusCode(401)
      .withCode(Codes.UNAUTHORIZED)
      .build();
  }
}
