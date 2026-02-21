import { getDatabase } from '@infrastructure/database/mongodb/connection';
import { translate } from '@shared/i18n';
import { POSTS } from '@shared/constants/i18n.keys';

const COLLECTION = 'posts';

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
