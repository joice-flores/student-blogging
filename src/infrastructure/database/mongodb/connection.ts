import { MongoClient, Db } from 'mongodb';
import { ENVIRONMENT } from '@shared/constants/i18n.keys';
import { translate } from '@shared/i18n';

let client: MongoClient;
let db: Db;

export async function connectDatabase(uri: string): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();

  console.log(translate(ENVIRONMENT.MONGODB.SUCCESS.CONNECTED));

  return db;
}

export function getDatabase(): Db {
  if (!db) throw new Error(ENVIRONMENT.MONGODB.ERRORS.CONNECTED);
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) await client.close();
}
