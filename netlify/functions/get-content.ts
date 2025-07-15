import { Handler } from '@netlify/functions';
import { connectToDatabase } from './mongodb';

const handler: Handler = async (event, context) => {
  console.log(JSON.stringify(event?.queryStringParameters));

  try {
    const { db } = await connectToDatabase();

    // console.log('Connected to MongoDB ' + JSON.stringify(db.listCollections()));
    const collection = db.collection('schlosswochen-content-index');
    
    // Fetch all content documents, sorted by sortorder
    const content = await collection.find({ active: true }).sort({ sortorder: 1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: content }),
    };
  } catch (error) {
    console.error('MongoDB error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch content from database' }),
    };
  }
};

export { handler };
