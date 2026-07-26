import { LessonPlanId } from '@domain/lesson-plan/value-objects/lesson-plan-id';
import { Subject } from '@domain/lesson-plan/value-objects/subject';
import { Grade } from '@domain/lesson-plan/value-objects/grade';
import { Theme } from '@domain/lesson-plan/value-objects/theme';
import { ScheduleStep } from '@domain/lesson-plan/value-objects/schedule-step';

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
    this._id = props.id || LessonPlanId.create();
    this._subject = props.subject;
    this._grade = props.grade;
    this._theme = props.theme;
    this._objectives = [...props.objectives];
    this._content = props.content;
    this._methodology = props.methodology;
    this._schedule = [...props.schedule];
    this._assessment = props.assessment;
    this._resources = [...props.resources];
    this._teacherId = props.teacherId;
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
}
