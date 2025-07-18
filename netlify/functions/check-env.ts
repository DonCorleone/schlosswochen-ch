import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  console.log('check-env function called');
  
  const envVars = [
    'MONGODB_URI',
    'MONGODB_DB_NAME',
    'NODE_ENV',
    'NETLIFY_DEV'
  ];

  const envStatus = envVars.reduce((acc, varName) => {
    const value = process.env[varName];
    acc[varName] = {
      exists: !!value,
      length: value?.length || 0,
      preview: value ? value.substring(0, 10) + '...' : 'not set'
    };
    return acc;
  }, {} as Record<string, any>);

  return {
    statusCode: 200,
    body: JSON.stringify({
      environment: {
        NODE_ENV: process.env['NODE_ENV'],
        NETLIFY_DEV: process.env['NETLIFY_DEV'],
        isProduction: !!context?.awsRequestId,
        awsRequestId: context?.awsRequestId?.substring(0, 10) + '...' || 'not set'
      },
      variables: envStatus,
      timestamp: new Date().toISOString()
    }, null, 2),
  };
};

export { handler };
