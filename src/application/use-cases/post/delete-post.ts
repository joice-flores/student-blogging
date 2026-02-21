import { ObjectId } from 'mongodb';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';

const COLLECTION = 'posts';

export async function deletePost(id: string) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const result = await db.collection(COLLECTION).deleteOne({ _id });
  if (result.deletedCount === 0)
    throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return true;
}
