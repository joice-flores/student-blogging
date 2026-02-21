import { PostId } from '@domain/value-objects/post-id';

export interface PostProps {
  id?: PostId;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Post {
  private readonly _id: PostId;
  private _title: string;
  private _content: string;
  private _author: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PostProps) {
    this._id = props.id || PostId.create();
    this._title = props.title;
    this._content = props.content;
    this._author = props.author;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Content is required');
    }
    if (!this._author || this._author.trim().length === 0) {
      throw new Error('Author is required');
    }
  }

  get id(): PostId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get author(): string {
    return this._author;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(title: string, content: string): void {
    this._title = title;
    this._content = content;
    this._updatedAt = new Date();
    this.validate();
  }
}
