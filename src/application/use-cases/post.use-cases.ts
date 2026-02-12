import { ObjectId } from 'mongodb';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { CreatePostDto, UpdatePostDto } from '@application/dtos/post.dto';

const COLLECTION = 'posts';

export async function createPost(dto: CreatePostDto) {
  if (!dto.title) throw new Error(translate(POSTS.ERRORS.TITLE_REQUIRED));
  if (!dto.content) throw new Error(translate(POSTS.ERRORS.CONTENT_REQUIRED));
  if (!dto.author) throw new Error(translate(POSTS.ERRORS.AUTHOR_REQUIRED));

  const db = getDatabase();
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({
    title: dto.title,
    content: dto.content,
    author: dto.author,
    createdAt: now,
    updatedAt: now
  });

  return { ...dto, _id: result.insertedId.toString(), createdAt: now, updatedAt: now };
}

export async function listPosts(limit = 50, skip = 0) {
  const db = getDatabase();
  const items = await db
    .collection(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return items.map(i => ({ ...i, _id: i._id.toString() }));
}

export async function getPostById(id: string) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const item = await db.collection(COLLECTION).findOne({ _id });
  if (!item) throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return { ...item, _id: item._id.toString() };
}

export async function updatePost(id: string, dto: UpdatePostDto) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const update = { ...dto, updatedAt: new Date() } as any;
  const result = await db.collection(COLLECTION).findOneAndUpdate({ _id }, { $set: update }, { returnDocument: 'after' as any });
  if (!result.value) throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return { ...result.value, _id: result.value._id.toString() };
}

export async function deletePost(id: string) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const result = await db.collection(COLLECTION).deleteOne({ _id });
  if (result.deletedCount === 0) throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return true;
}

export async function searchPosts(q: string, limit = 50) {
  if (!q) throw new Error(translate(POSTS.ERRORS.SEARCH_QUERY_REQUIRED));
  const db = getDatabase();
  const items = await db
    .collection(COLLECTION)
    .find({ $text: { $search: q } })
    .limit(limit)
    .toArray();

  return items.map(i => ({ ...i, _id: i._id.toString() }));
}
