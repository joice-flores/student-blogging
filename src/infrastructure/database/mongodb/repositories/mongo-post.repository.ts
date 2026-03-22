import { Collection, Db } from 'mongodb';
import { Post, PostId, IPostRepository } from '@domain/post';
import { ListPostsDto } from '@application/post/dto/post.dto';
import { PostDocument } from '@infrastructure/database/schemas/post.schema';

export class MongoPostRepository implements IPostRepository {
  private collection: Collection<PostDocument>;

  constructor(database: Db) {
    this.collection = database.collection<PostDocument>('posts');
  }

  async create(post: Post): Promise<void> {
    const document: PostDocument = {
      _id: post.id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };

    await this.collection.insertOne(document);
  }

  async findById(id: PostId): Promise<Post | null> {
    const document = await this.collection.findOne({
      _id: id.toString()
    });

    return document ? this.toDomain(document) : null;
  }

  async findAllPaginated(
    input: ListPostsDto
  ): Promise<{ posts: Post[]; total: number }> {
    const [documents, total] = await Promise.all([
      this.collection.find().skip(input.skip).limit(input.limit).toArray(),
      this.collection.countDocuments()
    ]);

    return {
      posts: documents.map(doc => this.toDomain(doc)),
      total
    };
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

    return docs.map(doc => this.toDomain(doc));
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
