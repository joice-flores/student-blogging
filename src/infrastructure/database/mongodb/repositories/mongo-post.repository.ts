import { Collection, Db } from 'mongodb';
import { Post, PostId, IPostRepository } from '@domain/post';

interface PostDocument {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoPostRepository implements IPostRepository {
  private collection: Collection;

  constructor(database: Db) {
    this.collection = database.collection('posts');
  }

  async create(post: Post): Promise<void> {
    const document = {
      _id: post.id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    } as PostDocument;

    await this.collection.insertOne(document);
  }

  async findById(id: PostId): Promise<Post | null> {
    const document = await this.collection.findOne({
      _id: id.toString()
    });

    return document ? this.toDomain(document as unknown as PostDocument) : null;
  }

  async findAll(): Promise<Post[]> {
    const documents = await this.collection.find().toArray();

    return documents.map(doc => this.toDomain(doc as unknown as PostDocument));
  }

  async update(post: Post): Promise<Post | null> {
    const document = await this.collection.updateOne(
      { _id: post.id.toString() },
      {
        $set: {
          title: post.title,
          content: post.content,
          updatedAt: post.updatedAt
        }
      }
    );

    return document?.matchedCount > 0 ? post : null;
  }

  async delete(id: PostId): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: id.toString()
    });

    return result.deletedCount > 0;
  }

  async search(keyword: string): Promise<Post[]> {
    const docs = await this.collection
      .find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } }
        ]
      })
      .toArray();

    return docs.map(doc => this.toDomain(doc as unknown as PostDocument));
  }

  private toDomain(doc: PostDocument): Post {
    return new Post({
      id: PostId.create(doc._id.toString()),
      title: doc.title,
      content: doc.content,
      author: doc.author,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}
