import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export const ALLOWED_GRADES = [
  '1º ano do Ensino Fundamental',
  '2º ano do Ensino Fundamental',
  '3º ano do Ensino Fundamental',
  '4º ano do Ensino Fundamental',
  '5º ano do Ensino Fundamental',
  '6º ano do Ensino Fundamental',
  '7º ano do Ensino Fundamental',
  '8º ano do Ensino Fundamental',
  '9º ano do Ensino Fundamental',
  '1ª série do Ensino Médio',
  '2ª série do Ensino Médio',
  '3ª série do Ensino Médio'
] as const;

export type AllowedGrade = (typeof ALLOWED_GRADES)[number];

export class Grade {
  private readonly value: AllowedGrade;

  private constructor(value: AllowedGrade) {
    this.value = value;
  }

  static create(value: string): Grade {
    const normalized = value.trim();

    if (!this.isAllowed(normalized)) {
      throw LessonPlanError.invalidGrade();
    }

    return new Grade(normalized);
  }

  private static isAllowed(value: string): value is AllowedGrade {
    return (ALLOWED_GRADES as readonly string[]).includes(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Grade): boolean {
    return this.value === other.value;
  }
}
