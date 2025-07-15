import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  const uri = process.env['MONGODB_URI'];
  const dbName = process.env['MONGODB_DB_NAME'] || 'staticDb';

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured');
  }

  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create new connection
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Cache the connection for future use
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
