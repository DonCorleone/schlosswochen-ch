import { Handler } from '@netlify/functions';
import { connectToDatabase } from './mongodb.mjs';

const handler: Handler = async (event, context) => {
  console.log('get-content function called with params:', JSON.stringify(event?.queryStringParameters));
  
  // Debug environment variables (without exposing sensitive data)
  console.log('Environment check:', {
    hasMongoUri: !!process.env['MONGODB_URI'],
    mongoDbName: process.env['MONGODB_DB_NAME'],
    nodeEnv: process.env['NODE_ENV']
  });

  try {
    // Add timeout to the entire operation - reduced to 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Function timeout after 10 seconds')), 10000);
    });

    const operationPromise = async () => {
      console.log('Attempting to connect to MongoDB...');
      const { db } = await connectToDatabase();
      console.log('Connected to MongoDB successfully');

      const collection = db.collection('schlosswochen-content-index');
      console.log('Fetching content from collection...');
      
      // Fetch all content documents, sorted by sortorder
      const content = await collection.find({ active: true }).sort({ sortorder: 1 }).toArray();
      console.log(`Found ${content.length} content items`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: content }),
      };
    };

    // Race between operation and timeout
    const result = await Promise.race([operationPromise(), timeoutPromise]);
    return result as any;

  } catch (error) {
    console.error('MongoDB error:', error);
    
    // Return more detailed error information
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch content from database',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};

export { handler };
