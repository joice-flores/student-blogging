import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectDatabase(uri: string): Promise {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();

  console.log('MongoDB connected successfully');
  return db;
}

export function getDatabase(): Db {
  if (!db) throw new Error('Database not connected');
  return db;
}

export async function closeDatabase(): Promise {
  if (client) await client.close();
}
