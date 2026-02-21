import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { CreatePostDto } from '@application/dtos/post.dto';

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

  return {
    ...dto,
    _id: result.insertedId.toString(),
    createdAt: now,
    updatedAt: now
  };
}
