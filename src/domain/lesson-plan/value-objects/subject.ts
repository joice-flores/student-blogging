import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export const ALLOWED_SUBJECTS = [
  'Língua Portuguesa',
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Física',
  'Química',
  'Biologia',
  'Inglês',
  'Educação Física',
  'Arte',
  'Filosofia',
  'Sociologia'
] as const;

export type AllowedSubject = (typeof ALLOWED_SUBJECTS)[number];

export class Subject {
  private readonly value: AllowedSubject;

  private constructor(value: AllowedSubject) {
    this.value = value;
  }

  static create(value: string): Subject {
    const normalized = value.trim();

    if (!this.isAllowed(normalized)) {
      throw LessonPlanError.invalidSubject();
    }

    return new Subject(normalized);
  }

  private static isAllowed(value: string): value is AllowedSubject {
    return (ALLOWED_SUBJECTS as readonly string[]).includes(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Subject): boolean {
    return this.value === other.value;
  }
}
