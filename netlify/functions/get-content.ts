import { Handler } from '@netlify/functions';
const axios = require('axios');

const handler: Handler = async (event, context) => {
  console.log(JSON.stringify(event?.queryStringParameters));


  const config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/schlosswochen-ch-tfxqz/endpoint/content',
    data: {},
  };

  return axios(config)
    .then(function (response: { data: any; }) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: response.data }),
      };
    })
    .catch(function (error: any) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: error }),
      };
    });
};

export { handler };
