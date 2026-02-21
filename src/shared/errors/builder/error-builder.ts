import { AppError } from '@shared/errors/builder/app-error';
import { Code, Codes } from '@shared/errors/builder/codes';
import { translate } from '@shared/i18n';
import { ERRORS } from '@shared/constants/i18n.keys';
import z from 'zod';

export class ErrorBuilder {
  private _message?: string;
  private _statusCode: number = 400;
  private _code?: Code;
  private _details?: unknown;
  private _i18nKey?: string;
  private _i18nParams?: Record<string, unknown>;

  static create(): ErrorBuilder {
    return new ErrorBuilder();
  }

  withMessage(message: string): this {
    this._message = message;
    return this;
  }

  withI18nKey(key: string, params?: Record<string, unknown>): this {
    this._i18nKey = key;
    this._i18nParams = params;
    return this;
  }

  withStatusCode(statusCode: number): this {
    this._statusCode = statusCode;
    return this;
  }

  withCode(code: Code): this {
    this._code = code;
    return this;
  }

  withDetails(details: unknown): this {
    this._details = details;
    return this;
  }

  build(): AppError {
    let message = this._message;

    if (this._i18nKey) {
      console.log(this._i18nParams);
      message = translate(this._i18nKey);
    }

    if (!message) {
      message = 'An error occurred';
    }

    return new AppError(message, this._statusCode, this._code, this._details);
  }

  throw(): never {
    throw this.build();
  }

  static notFound(message?: string): AppError {
    return ErrorBuilder.create()
      .withMessage(message || translate(ERRORS.NOT_FOUND))
      .withStatusCode(404)
      .withCode(Codes.NOT_FOUND)
      .build();
  }

  static badRequest(message?: string): AppError {
    return ErrorBuilder.create()
      .withMessage(message || translate(ERRORS.BAD_REQUEST))
      .withStatusCode(400)
      .withCode(Codes.BAD_REQUEST)
      .build();
  }

  static internal(message?: string): AppError {
    return ErrorBuilder.create()
      .withMessage(message || translate(ERRORS.INTERNAL))
      .withStatusCode(500)
      .withCode(Codes.INTERNAL_ERROR)
      .build();
  }

  static validation(message: string, details?: unknown): AppError {
    return ErrorBuilder.create()
      .withMessage(message)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .withDetails(details)
      .build();
  }

  static fromZodError(error: z.ZodError): AppError {
    type issueType = { path: unknown[]; message: unknown; code: unknown };

    const errors = error.issues.map((issue: issueType) => ({
      field: issue.path.join('.') || 'root',
      message: issue.message,
      code: issue.code
    }));

    const hasError = errors.length > 0;

    const mainMessage = hasError
      ? `Validation failed: ${errors[0].message}`
      : 'Validation failed';

    return ErrorBuilder.create()
      .withMessage(mainMessage)
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .withDetails({ errors })
      .build();
  }

  static fromZodErrorFlattened(error: z.ZodError): AppError {
    const fieldErrors = error.flatten().fieldErrors;

    return ErrorBuilder.create()
      .withMessage('Validation failed')
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .withDetails({ fields: fieldErrors })
      .build();
  }

  static fromZodErrorFormatted(error: z.ZodError): AppError {
    const formatted = error.format();

    return ErrorBuilder.create()
      .withMessage('Validation failed')
      .withStatusCode(400)
      .withCode(Codes.VALIDATION_ERROR)
      .withDetails({ fields: formatted })
      .build();
  }
}
