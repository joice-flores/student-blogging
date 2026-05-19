import { UserId } from '@domain/user/value-objects/user-id';
import { Email } from '@domain/user/value-objects/email';
import { Role, RoleValue } from '@domain/user/value-objects/role';

export type UserRole = RoleValue;

export interface UserProps {
  id?: UserId;
  name: string;
  email: Email;
  password: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateUserProps = Omit<UserProps, 'role' | 'createdAt' | 'updatedAt'> & {
  role?: Role;
};

export class User {
  private readonly _id: UserId;
  private _name: string;
  private readonly _email: Email;
  private _password: string;
  private _role: Role;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id || UserId.create();
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!this._password || this._password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  get id(): UserId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(props: { name?: string; role?: Role }): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error('Name is required');
      }
      this._name = props.name.trim();
    }
    if (props.role !== undefined) {
      this._role = props.role;
    }
    this._updatedAt = new Date();
  }

  static create(props: CreateUserProps): User {
    return new User({
      id: props.id === undefined ? UserId.create() : props.id,
      name: props.name,
      email: props.email,
      password: props.password,
      role: props.role ?? Role.default(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }
}
