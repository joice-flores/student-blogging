import { Collection, Db, Filter } from 'mongodb';
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

export class MongoLessonPlanRepository implements ILessonPlanRepository {
  private collection: Collection<LessonPlanDocument>;

  constructor(database: Db) {
    this.collection = database.collection<LessonPlanDocument>('lesson_plans');
  }

  async create(lessonPlan: LessonPlan): Promise<void> {
    const document: LessonPlanDocument = {
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

    await this.collection.insertOne(document);
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
    filter: Filter<LessonPlanDocument>,
    query: ListLessonPlansQuery
  ): Promise<{ lessonPlans: LessonPlan[]; total: number }> {
    const [documents, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort({ createdAt: -1 })
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

  private toDomain(document: LessonPlanDocument): LessonPlan {
    return LessonPlan.reconstitute({
      id: LessonPlanId.create(document._id),
      subject: Subject.create(document.subject),
      grade: Grade.create(document.grade),
      theme: Theme.create(document.theme),
      objectives: document.objectives,
      content: document.content,
      methodology: document.methodology,
      schedule: document.schedule.map(step => ScheduleStep.create(step)),
      assessment: document.assessment,
      resources: document.resources,
      teacherId: document.teacherId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    });
  }
}
