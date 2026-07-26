import { Collection, Db, Filter, MongoServerError, Sort } from 'mongodb';
import {
  Grade,
  ILessonPlanRepository,
  LessonPlan,
  LessonPlanId,
  ListLessonPlansQuery,
  ScheduleStep,
  Subject,
  Theme
} from '@domain/lesson-plan';
import { LessonPlanDocument } from '@infrastructure/database/schemas/lesson-plan.schema';
import { LessonPlanError } from '@shared/errors/lesson-plan/lesson-plan-error';

export class MongoLessonPlanRepository implements ILessonPlanRepository {
  private readonly collection: Collection<LessonPlanDocument>;

  constructor(database: Db) {
    this.collection = database.collection<LessonPlanDocument>('lesson_plans');
    void this.createIndexes();
  }

  private async createIndexes(): Promise<void> {
    await this.collection.createIndex(
      { teacherId: 1, createdAt: -1 },
      { name: 'teacherId_createdAt' }
    );
  }

  async create(lessonPlan: LessonPlan): Promise<void> {
    try {
      await this.collection.insertOne(this.toDocument(lessonPlan));
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw LessonPlanError.conflict();
      }

      throw error;
    }
  }

  async findById(id: LessonPlanId): Promise<LessonPlan | null> {
    const document = await this.collection.findOne({ _id: id.toString() });
    return document ? this.toDomain(document) : null;
  }

  async findByTeacherId(
    teacherId: string,
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }> {
    return this.findWithFilter({ teacherId }, query);
  }

  async findAll(
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }> {
    return this.findWithFilter({}, query);
  }

  async delete(id: LessonPlanId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id.toString() });
    return result.deletedCount > 0;
  }

  private async findWithFilter(
    baseFilter: Filter<LessonPlanDocument>,
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }> {
    const filter = this.buildFilter(baseFilter, query);
    const sort = this.buildSort(query);

    const [documents, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort(sort)
        .skip(query.skip)
        .limit(query.limit)
        .toArray(),
      this.collection.countDocuments(filter)
    ]);

    return {
      lessonPlans: documents.map(document => this.toDomain(document)),
      total
    };
  }

  private buildFilter(
    baseFilter: Filter<LessonPlanDocument>,
    query: ListLessonPlansQuery
  ): Filter<LessonPlanDocument> {
    return {
      ...baseFilter,
      ...(query.subject ? { subject: query.subject } : {}),
      ...(query.grade ? { grade: query.grade } : {})
    };
  }

  private buildSort(query: ListLessonPlansQuery): Sort {
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    return { [sortBy]: sortOrder };
  }

  private toDocument(lessonPlan: LessonPlan): LessonPlanDocument {
    return {
      _id: lessonPlan.id.toString(),
      subject: lessonPlan.subject.getValue(),
      grade: lessonPlan.grade.getValue(),
      theme: lessonPlan.theme.getValue(),
      objectives: [...lessonPlan.objectives],
      content: lessonPlan.content,
      methodology: lessonPlan.methodology,
      schedule: lessonPlan.schedule.map(step => step.toObject()),
      assessment: lessonPlan.assessment,
      resources: [...lessonPlan.resources],
      teacherId: lessonPlan.teacherId,
      createdAt: lessonPlan.createdAt,
      updatedAt: lessonPlan.updatedAt
    };
  }

  private toDomain(document: LessonPlanDocument): LessonPlan {
    return LessonPlan.reconstitute({
      id: LessonPlanId.create(document._id),
      subject: Subject.create(document.subject),
      grade: Grade.create(document.grade),
      theme: Theme.create(document.theme),
      objectives: [...document.objectives],
      content: document.content,
      methodology: document.methodology,
      schedule: document.schedule.map(step => ScheduleStep.create(step)),
      assessment: document.assessment,
      resources: [...document.resources],
      teacherId: document.teacherId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
  }

  private isDuplicateKeyError(error: unknown): boolean {
    return error instanceof MongoServerError && error.code === 11000;
  }
}
