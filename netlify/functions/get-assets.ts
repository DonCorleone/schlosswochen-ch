import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  const path = event.queryStringParameters?.['path'] || '';
  
  if (!process.env['API_KEY_NETLIFY'] || !process.env['SITE_ID']) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Netlify API configuration missing' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${process.env['SITE_ID']}/files/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env['API_KEY_NETLIFY']}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching assets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch assets' }),
    };
  }
};

export { handler };
