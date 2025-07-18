import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  const uri = process.env['MONGODB_URI'];
  const dbName = process.env['MONGODB_DB_NAME'] || 'staticDb';

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured');
  }

  // Test if cached connection is still alive
  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if connection is alive
      await cachedDb.admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.warn('Cached connection is dead, creating new one');
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection with timeout settings
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 10000,        // 10 second timeout
    socketTimeoutMS: 10000,         // 10 second timeout
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  try {
    await client.connect();
    const db = client.db(dbName);

    // Test the connection
    await db.admin().ping();

    // Cache the connection for future use
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    await client.close();
    throw error;
  }
}
