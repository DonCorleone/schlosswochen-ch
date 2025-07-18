import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const handler: Handler = async (event, context) => {
  console.log('test-mongo function called');
  console.log('Environment:', process.env['NODE_ENV']);
  console.log('Netlify context:', context?.awsRequestId ? 'AWS Lambda' : 'Local');
  
  const uri = process.env['MONGODB_URI'];
  const dbName = process.env['MONGODB_DB_NAME'] || 'staticDb';

  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'MONGODB_URI not configured',
        env: process.env['NODE_ENV'],
        context: context?.awsRequestId ? 'production' : 'local'
      }),
    };
  }

  console.log('Connection string starts with:', uri.substring(0, 20) + '...');
  console.log('Database name:', dbName);
  console.log('Connection string contains srv:', uri.includes('mongodb+srv'));
  console.log('Connection string contains ssl:', uri.includes('ssl=true'));

  try {
    // Test multiple connection strategies
    const strategies = [
      {
        name: 'Strategy 1: Minimal config (let driver handle SSL)',
        config: {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        }
      },
      {
        name: 'Strategy 2: Explicit TLS with retries',
        config: {
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
          tls: true,
          retryWrites: true,
          retryReads: true,
        }
      },
      {
        name: 'Strategy 3: Legacy SSL support',
        config: {
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          ssl: true,
          sslValidate: true,
        }
      }
    ];

    for (const strategy of strategies) {
      console.log(`Trying ${strategy.name}...`);
      
      try {
        const client = new MongoClient(uri, strategy.config);
        
        console.log('Attempting to connect...');
        await client.connect();
        console.log('Connected successfully');

        const db = client.db(dbName);
        console.log('Database selected');

        // Quick test - list collections
        const collections = await db.listCollections().toArray();
        console.log('Collections found:', collections.length);

        // Test actual data access
        const contentCollection = db.collection('schlosswochen-content-index');
        const count = await contentCollection.countDocuments();
        console.log('Content documents count:', count);

        await client.close();
        console.log('Connection closed');

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            strategy: strategy.name,
            database: dbName,
            collections: collections.length,
            collectionNames: collections.map(c => c.name),
            contentCount: count,
            environment: process.env['NODE_ENV'],
            isProduction: !!context?.awsRequestId
          }),
        };

      } catch (strategyError) {
        console.error(`${strategy.name} failed:`, strategyError);
        // Continue to next strategy
      }
    }

    // If all strategies failed
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'All connection strategies failed',
        environment: process.env['NODE_ENV'],
        isProduction: !!context?.awsRequestId,
        uriFormat: uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard',
        suggestions: [
          'Check MongoDB Atlas Network Access (IP Whitelist)',
          'Verify connection string format',
          'Check if MongoDB cluster is running',
          'Verify environment variables in Netlify dashboard'
        ]
      }),
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env['NODE_ENV'],
        isProduction: !!context?.awsRequestId
      }),
    };
  }
};

export { handler };
