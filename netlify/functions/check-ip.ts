import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  console.log('check-ip function called');
  
  try {
    // Try to get external IP using multiple services
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://httpbin.org/ip',
      'https://icanhazip.com',
    ];

    const results = [];
    
    for (const service of ipServices) {
      try {
        const response = await fetch(service);
        const text = await response.text();
        
        let ip = text.trim();
        
        // Parse JSON responses
        if (service.includes('ipify') || service.includes('httpbin')) {
          const json = JSON.parse(text);
          ip = json.ip || json.origin;
        }
        
        results.push({
          service: service,
          ip: ip,
          success: true
        });
      } catch (error) {
        results.push({
          service: service,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Netlify Function IP Information',
        environment: {
          NODE_ENV: process.env['NODE_ENV'],
          isProduction: !!context?.awsRequestId,
          awsRequestId: context?.awsRequestId?.substring(0, 10) + '...' || 'not set'
        },
        ipResults: results,
        headers: {
          'x-forwarded-for': event.headers['x-forwarded-for'],
          'x-real-ip': event.headers['x-real-ip'],
          'cf-connecting-ip': event.headers['cf-connecting-ip'],
        },
        timestamp: new Date().toISOString(),
        instructions: [
          'Add the IP shown above to MongoDB Atlas Network Access',
          'Or use 0.0.0.0/0 to allow all IPs (recommended for serverless)'
        ]
      }, null, 2),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to get IP information',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
