export default async (request: Request) => {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Add CORS headers for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Return configuration object with environment variables
    const config = {
      googleMapsApiKey: process.env['API_KEY_GMAPS'] || '',
      environment: process.env['NODE_ENV'] || 'production',
      version: process.env['npm_package_version'] || '1.0.0'
    };

    return new Response(JSON.stringify(config), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error getting configuration:', error);
    return new Response(JSON.stringify({ error: 'Failed to load configuration' }), {
      status: 500,
      headers
    });
  }
};
