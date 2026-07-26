import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export type ScheduleStepProps = {
  readonly duration: string;
  readonly description: string;
};

export class ScheduleStep {
  private readonly duration: string;
  private readonly description: string;

  private constructor(props: ScheduleStepProps) {
    this.duration = props.duration;
    this.description = props.description;
  }

  static create(props: ScheduleStepProps): ScheduleStep {
    const duration = props.duration.trim();
    const description = props.description.trim();

    if (!duration || !description) {
      throw LessonPlanError.invalidScheduleStep();
    }

    return new ScheduleStep({ duration, description });
  }

  getDuration(): string {
    return this.duration;
  }

  getDescription(): string {
    return this.description;
  }

  toObject(): ScheduleStepProps {
    return {
      duration: this.duration,
      description: this.description
    };
  }
}
