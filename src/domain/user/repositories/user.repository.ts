import { User } from '@domain/user/entities/user';
import { Email } from '@domain/user/value-objects/email';
import { UserId } from '@domain/user/value-objects/user-id';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
