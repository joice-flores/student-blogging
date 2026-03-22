import { z } from 'zod';
import { AppError } from '@shared/errors/builder/app-error';
import { ErrorBuilder } from '@shared/errors/builder/error-builder';
import { Codes } from '@shared/errors/builder/codes';
import { ERRORS } from '@shared/constants/i18n.keys';
import { UserError } from '@shared/errors/user/user-error';
import { changeLanguage, translate } from '@shared/i18n';

describe('AppError', () => {
  it('serializes to JSON', () => {
    const error = new AppError('Test error', 418, 'TEAPOT', { foo: 'bar' });

    expect(error.toJSON()).toEqual({
      error: {
        message: 'Test error',
        statusCode: 418,
        code: 'TEAPOT',
        details: { foo: 'bar' }
      }
    });
  });

  it('uses default status code when omitted', () => {
    const error = new AppError('Default error');

    expect(error.statusCode).toBe(400);
  });
});

describe('ErrorBuilder', () => {
  it('builds with a default message', () => {
    const error = ErrorBuilder.create().build();

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('An error occurred');
  });

  it('builds using i18n keys', () => {
    const error = ErrorBuilder.create().withI18nKey(ERRORS.BAD_REQUEST).build();

    expect(error.message).toBe(translate(ERRORS.BAD_REQUEST));
  });

  it('throws using throw()', () => {
    expect(() => ErrorBuilder.create().withMessage('Boom').throw()).toThrow(
      'Boom'
    );
  });

  it('creates not found, bad request, and internal errors', () => {
    const notFound = ErrorBuilder.notFound();
    const badRequest = ErrorBuilder.badRequest();
    const internal = ErrorBuilder.internal();

    expect(notFound.statusCode).toBe(404);
    expect(notFound.code).toBe(Codes.NOT_FOUND);
    expect(badRequest.statusCode).toBe(400);
    expect(badRequest.code).toBe(Codes.BAD_REQUEST);
    expect(internal.statusCode).toBe(500);
    expect(internal.code).toBe(Codes.INTERNAL_ERROR);
  });

  it('uses provided messages for common errors', () => {
    const notFound = ErrorBuilder.notFound('Missing');
    const badRequest = ErrorBuilder.badRequest('Invalid');
    const internal = ErrorBuilder.internal('Boom');

    expect(notFound.message).toBe('Missing');
    expect(badRequest.message).toBe('Invalid');
    expect(internal.message).toBe('Boom');
  });

  it('creates validation errors with details', () => {
    const error = ErrorBuilder.validation('Invalid', { field: 'name' });

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(Codes.VALIDATION_ERROR);
    expect(error.details).toEqual({ field: 'name' });
  });

  it('creates errors from zod issues', () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = schema.safeParse({ name: '' });

    if (result.success) {
      throw new Error('Expected validation to fail');
    }

    const error = ErrorBuilder.fromZodError(result.error);

    expect(error.statusCode).toBe(400);
    expect(error.details).toMatchObject({
      errors: [
        {
          field: 'name'
        }
      ]
    });
  });

  it('uses root field when zod issue has empty path', () => {
    const issue = {
      code: 'custom',
      message: 'Invalid',
      path: []
    } as z.ZodIssue;

    const error = ErrorBuilder.fromZodError(new z.ZodError([issue]));

    expect(error.details).toMatchObject({
      errors: [
        {
          field: 'root'
        }
      ]
    });
  });

  it('creates errors from empty zod issues', () => {
    const error = ErrorBuilder.fromZodError(new z.ZodError([]));

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Validation failed');
    expect(error.details).toMatchObject({ errors: [] });
  });

  it('creates errors from zod flattened output', () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = schema.safeParse({ name: '' });

    if (result.success) {
      throw new Error('Expected validation to fail');
    }

    const error = ErrorBuilder.fromZodErrorFlattened(result.error);

    expect(error.statusCode).toBe(400);
    expect(error.details).toMatchObject({
      fields: {
        name: expect.any(Array)
      }
    });
  });

  it('creates errors from zod formatted output', () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = schema.safeParse({ name: '' });

    if (result.success) {
      throw new Error('Expected validation to fail');
    }

    const error = ErrorBuilder.fromZodErrorFormatted(result.error);

    expect(error.statusCode).toBe(400);
    expect(error.details).toMatchObject({
      fields: expect.any(Object)
    });
  });
});

describe('UserError', () => {
  it('creates not found and unauthorized errors', () => {
    const notFound = UserError.notFound();
    const unauthorized = UserError.unauthorized();

    expect(notFound.statusCode).toBe(404);
    expect(notFound.code).toBe(Codes.NOT_FOUND);
    expect(unauthorized.statusCode).toBe(401);
    expect(unauthorized.code).toBe(Codes.UNAUTHORIZED);
  });
});

describe('i18n helpers', () => {
  it('changes language and translates', async () => {
    await changeLanguage('en-US');

    expect(translate(ERRORS.NOT_FOUND)).toBe('Resource not found');
  });
});

describe('i18n config', () => {
  const originalLanguage = process.env.DEFAULT_LANGUAGE;

  afterEach(() => {
    if (originalLanguage === undefined) {
      delete process.env.DEFAULT_LANGUAGE;
    } else {
      process.env.DEFAULT_LANGUAGE = originalLanguage;
    }
    jest.resetModules();
  });

  it('uses DEFAULT_LANGUAGE env when provided', async () => {
    process.env.DEFAULT_LANGUAGE = 'pt-BR';
    jest.resetModules();

    const { default: i18n } = await import('@shared/i18n/i18n.config');

    expect(i18n.options?.lng).toBe('pt-BR');
  });

  it('falls back when DEFAULT_LANGUAGE is missing', async () => {
    delete process.env.DEFAULT_LANGUAGE;
    jest.resetModules();

    const { default: i18n } = await import('@shared/i18n/i18n.config');

    expect(i18n.options?.lng).toBe('en-US');
  });
});
