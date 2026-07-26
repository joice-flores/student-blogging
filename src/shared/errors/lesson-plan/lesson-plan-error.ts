import { ErrorBuilder, Codes, AppError } from '@shared/errors/builder';
import { LESSON_PLANS } from '@shared/constants/i18n.keys';

export class LessonPlanError extends ErrorBuilder {
  static invalidSubject(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.INVALID_SUBJECT)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .build();
  }

  static invalidGrade(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.INVALID_GRADE)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .build();
  }

  static invalidTheme(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.INVALID_THEME)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .build();
  }

  static invalidScheduleStep(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.INVALID_SCHEDULE_STEP)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .build();
  }

  static notFound(id?: string): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.NOT_FOUND)
      .withStatusCode(404)
      .withCode(Codes.NOT_FOUND)
      .withDetails({ lessonPlanId: id })
      .build();
  }

  static forbidden(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.FORBIDDEN)
      .withStatusCode(403)
      .withCode(Codes.FORBIDDEN)
      .build();
  }

  static conflict(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.CONFLICT)
      .withStatusCode(409)
      .withCode(Codes.BAD_REQUEST)
      .build();
  }

  static aiProviderUnavailable(): AppError {
    return this.create()
      .withI18nKey(LESSON_PLANS.ERRORS.AI_PROVIDER_UNAVAILABLE)
      .withStatusCode(500)
      .withCode(Codes.INTERNAL_ERROR)
      .build();
  }
}
