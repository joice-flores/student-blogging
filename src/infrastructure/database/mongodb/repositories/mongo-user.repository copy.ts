import { Collection, Db } from 'mongodb';
import { User } from '@domain/user/entities/user';
import { IUserRepository } from '@domain/user/repositories/user.repository';
import { Email } from '@domain/user/value-objects/email';
import { UserId } from '@domain/user/value-objects/user-id';
import { UserDocument } from '@infrastructure/database/schemas/user.schema';

export class MongoUserRepository implements IUserRepository {
  private readonly collection: Collection<UserDocument>;

  constructor(db: Db) {
    this.collection = db.collection<UserDocument>('users');
    this.createIndexes();
  }

  private async createIndexes(): Promise<void> {
    await this.collection.createIndex({ email: 1 }, { unique: true });
  }

  async findById(id: UserId): Promise<User | null> {
    const doc = await this.collection.findOne({ _id: id.getValue() });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const doc = await this.collection.findOne({ email: email.getValue() });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async save(user: User): Promise<void> {
    const doc: UserDocument = {
      _id: user.id.getValue(),
      name: user.name,
      email: user.email.getValue(),
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    await this.collection.replaceOne({ _id: doc._id }, doc, { upsert: true });
  }

  async delete(id: UserId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private toEntity(doc: UserDocument): User {
    return User.create({
      id: UserId.create(),
      name: doc.name,
      email: Email.create(doc.email),
      password: doc.password,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}
