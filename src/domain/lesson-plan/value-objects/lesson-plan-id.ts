import { randomUUID } from 'crypto';

export class LessonPlanId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value?: string): LessonPlanId {
    return new LessonPlanId(value || randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: LessonPlanId): boolean {
    return this.value === other.value;
  }
}
