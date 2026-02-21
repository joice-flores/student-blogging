import { ObjectId } from 'mongodb';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';
import { UpdatePostDto } from '@application/dtos/post.dto';

const COLLECTION = 'posts';

export async function updatePost(id: string, dto: UpdatePostDto) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const update = { ...dto, updatedAt: new Date() } as any;
  const result = await db
    .collection(COLLECTION)
    .findOneAndUpdate(
      { _id },
      { $set: update },
      { returnDocument: 'after' as any }
    );
  if (!result.value) throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return { ...result.value, _id: result.value._id.toString() };
}
