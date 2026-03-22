import { UserId } from '@domain/user/value-objects/user-id';
import { Email } from '@domain/user/value-objects/email';

export interface UserProps {
  id?: UserId;
  name: string;
  email: Email;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: UserId;
  private _name: string;
  private readonly _email: Email;
  private _password: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id || UserId.create();
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(props: UserProps): User {
    return new User({
      id: props.id === undefined ? UserId.create() : props.id,
      name: props.name,
      email: props.email,
      password: props.password,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserProps);
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }
}
