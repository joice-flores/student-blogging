import { getDatabase } from '@infrastructure/database/mongodb/connection';

const COLLECTION = 'posts';

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
