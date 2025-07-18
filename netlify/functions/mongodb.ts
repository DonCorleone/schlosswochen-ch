import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  const uri = process.env['MONGODB_URI'];
  const dbName = process.env['MONGODB_DB_NAME'] || 'staticDb';

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured');
  }

  // Log connection attempt (without exposing sensitive data)
  console.log('Attempting MongoDB connection to database:', dbName);
  console.log('Connection string starts with:', uri.substring(0, 20) + '...');

  // Test if cached connection is still alive
  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if connection is alive
      await cachedDb.admin().ping();
      console.log('Using cached MongoDB connection');
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      console.warn('Cached connection is dead, creating new one:', error);
      cachedClient = null;
      cachedDb = null;
    }
  }

  // Create new connection with timeout settings
  let client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 10000,        // 10 second timeout
    socketTimeoutMS: 10000,         // 10 second timeout
    maxPoolSize: 10,
    minPoolSize: 1,
    // SSL/TLS configuration for Atlas
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    // Retry configuration
    retryWrites: true,
    retryReads: true,
    // Connection pool settings
    maxIdleTimeMS: 30000,
    maxConnecting: 2,
  });

  try {
    console.log('Creating new MongoDB client with full SSL config...');
    await client.connect();
    console.log('MongoDB client connected successfully');
    
    const db = client.db(dbName);
    console.log('Database selected:', dbName);

    // Test the connection
    await db.admin().ping();
    console.log('MongoDB ping successful');

    // Cache the connection for future use
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect with full SSL config:', error);
    
    // Clean up failed client
    try {
      await client.close();
    } catch (closeError) {
      console.warn('Failed to close failed client:', closeError);
    }

    // Try with minimal SSL configuration as fallback
    console.log('Attempting fallback connection with minimal SSL...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      maxPoolSize: 5,
      minPoolSize: 1,
      retryWrites: true,
    });

    try {
      await client.connect();
      const db = client.db(dbName);
      await db.admin().ping();
      
      cachedClient = client;
      cachedDb = db;
      
      console.log('Fallback connection successful');
      return { client, db };
    } catch (fallbackError) {
      console.error('Fallback connection also failed:', fallbackError);
      try {
        await client.close();
      } catch (closeError) {
        console.warn('Failed to close fallback client:', closeError);
      }
      throw fallbackError;
    }
  }
}
