export default async (request: Request) => {
  
  if (!process.env['API_KEY_NETLIFY'] || !process.env['SITE_ID']) {
    return new Response(
      JSON.stringify({ error: 'Netlify API configuration missing' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${process.env['SITE_ID']}/files`,
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

    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error fetching assets:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch assets' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
