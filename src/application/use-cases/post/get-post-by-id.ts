import { ObjectId } from 'mongodb';
import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';

const COLLECTION = 'posts';

export async function getPostById(id: string) {
  const db = getDatabase();
  const _id = new ObjectId(id);
  const item = await db.collection(COLLECTION).findOne({ _id });
  if (!item) throw new Error(translate(POSTS.ERRORS.NOT_FOUND));
  return { ...item, _id: item._id.toString() };
}
