import { LessonPlanId } from '@domain/lesson-plan/value-objects/lesson-plan-id';
import { Subject } from '@domain/lesson-plan/value-objects/subject';
import { Grade } from '@domain/lesson-plan/value-objects/grade';
import { Theme } from '@domain/lesson-plan/value-objects/theme';
import { ScheduleStep } from '@domain/lesson-plan/value-objects/schedule-step';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export type LessonPlanProps = {
  id?: LessonPlanId;
  subject: Subject;
  grade: Grade;
  theme: Theme;
  objectives: string[];
  content: string;
  methodology: string;
  schedule: ScheduleStep[];
  assessment: string;
  resources: string[];
  teacherId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class LessonPlan {
  private readonly _id: LessonPlanId;
  private readonly _subject: Subject;
  private readonly _grade: Grade;
  private readonly _theme: Theme;
  private readonly _objectives: string[];
  private readonly _content: string;
  private readonly _methodology: string;
  private readonly _schedule: ScheduleStep[];
  private readonly _assessment: string;
  private readonly _resources: string[];
  private readonly _teacherId: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: LessonPlanProps) {
    const teacherId = props.teacherId.trim();
    const objectives = props.objectives
      .map(item => item.trim())
      .filter(Boolean);
    const content = props.content.trim();
    const methodology = props.methodology.trim();
    const assessment = props.assessment.trim();
    const resources = props.resources.map(item => item.trim()).filter(Boolean);
    const schedule = [...props.schedule];

    this.ensureTeacherId(teacherId);
    this.ensureObjectives(objectives);
    this.ensureContent(content);
    this.ensureMethodology(methodology);
    this.ensureSchedule(schedule);
    this.ensureAssessment(assessment);
    this.ensureResources(resources);

    this._id = props.id || LessonPlanId.create();
    this._subject = props.subject;
    this._grade = props.grade;
    this._theme = props.theme;
    this._objectives = objectives;
    this._content = content;
    this._methodology = methodology;
    this._schedule = schedule;
    this._assessment = assessment;
    this._resources = resources;
    this._teacherId = teacherId;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  static create(props: LessonPlanProps): LessonPlan {
    return new LessonPlan(props);
  }

  static reconstitute(props: LessonPlanProps): LessonPlan {
    return new LessonPlan(props);
  }

  get id(): LessonPlanId {
    return this._id;
  }

  get subject(): Subject {
    return this._subject;
  }

  get grade(): Grade {
    return this._grade;
  }

  get theme(): Theme {
    return this._theme;
  }

  get objectives(): readonly string[] {
    return this._objectives;
  }

  get content(): string {
    return this._content;
  }

  get methodology(): string {
    return this._methodology;
  }

  get schedule(): readonly ScheduleStep[] {
    return this._schedule;
  }

  get assessment(): string {
    return this._assessment;
  }

  get resources(): readonly string[] {
    return this._resources;
  }

  get teacherId(): string {
    return this._teacherId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  belongsToTeacher(teacherId: string): boolean {
    return this._teacherId === teacherId;
  }

  private ensureTeacherId(teacherId: string): void {
    if (!teacherId) {
      throw LessonPlanError.invalidTeacherId();
    }
  }

  private ensureObjectives(objectives: string[]): void {
    if (objectives.length === 0) {
      throw LessonPlanError.invalidObjectives();
    }
  }

  private ensureContent(content: string): void {
    if (!content) {
      throw LessonPlanError.invalidContent();
    }
  }

  private ensureMethodology(methodology: string): void {
    if (!methodology) {
      throw LessonPlanError.invalidMethodology();
    }
  }

  private ensureSchedule(schedule: ScheduleStep[]): void {
    if (schedule.length === 0) {
      throw LessonPlanError.invalidSchedule();
    }
  }

  private ensureAssessment(assessment: string): void {
    if (!assessment) {
      throw LessonPlanError.invalidAssessment();
    }
  }

  private ensureResources(resources: string[]): void {
    if (resources.length === 0) {
      throw LessonPlanError.invalidResources();
    }
  }
}
