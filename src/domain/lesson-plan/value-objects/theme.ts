import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

const MIN_THEME_LENGTH = 3;

export class Theme {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Theme {
    const normalized = value.trim();

    if (normalized.length < MIN_THEME_LENGTH) {
      throw LessonPlanError.invalidTheme();
    }

    return new Theme(normalized);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Theme): boolean {
    return this.value === other.value;
  }
}
