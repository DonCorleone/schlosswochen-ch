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

  // Skip cache check for now to avoid potential issues
  // Reset cache to force fresh connection
  if (cachedClient) {
    try {
      await cachedClient.close();
    } catch (e) {
      console.warn('Error closing cached client:', e);
    }
    cachedClient = null;
    cachedDb = null;
  }

  // Create new connection with minimal configuration
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 3000, // Reduced timeout
    connectTimeoutMS: 5000,         // Reduced timeout
    socketTimeoutMS: 5000,          // Reduced timeout
    maxPoolSize: 1,                 // Minimal pool size
    minPoolSize: 0,                 // No minimum
    retryWrites: true,
    appName: 'netlify-functions',   // Help identify connections
  });

  try {
    console.log('Creating new MongoDB client with minimal config...');
    
    // Set a shorter timeout for the connection attempt
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 8 seconds')), 8000);
    });

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('MongoDB client connected successfully');
    
    const db = client.db(dbName);
    console.log('Database selected:', dbName);

    // Quick ping test
    const pingPromise = db.admin().ping();
    const pingTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Ping timeout after 3 seconds')), 3000);
    });

    await Promise.race([pingPromise, pingTimeoutPromise]);
    console.log('MongoDB ping successful');

    // Cache the connection for future use
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // Clean up on failure
    try {
      await client.close();
    } catch (closeError) {
      console.warn('Failed to close failed client:', closeError);
    }
    
    throw error;
  }
}
