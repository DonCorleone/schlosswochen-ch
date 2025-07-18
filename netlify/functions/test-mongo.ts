import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const handler: Handler = async (event, context) => {
  console.log('test-mongo function called');
  
  const uri = process.env['MONGODB_URI'];
  const dbName = process.env['MONGODB_DB_NAME'] || 'staticDb';

  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'MONGODB_URI not configured' }),
    };
  }

  console.log('Connection string starts with:', uri.substring(0, 20) + '...');
  console.log('Database name:', dbName);

  try {
    // Very simple connection test
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully');

    const db = client.db(dbName);
    console.log('Database selected');

    // List collections to verify access
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);

    await client.close();
    console.log('Connection closed');

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        database: dbName,
        collections: collections.length,
        collectionNames: collections.map(c => c.name)
      }),
    };

  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
