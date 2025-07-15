// Server-side only environment (SSR/Netlify Functions)
export const serverEnvironment = {
  mongodb: {
    uri: process.env['MONGODB_URI'] || '',
    dbName: process.env['MONGODB_DB_NAME'] || 'schlosswochen',
  },
  netlify: {
    emailsSecret: process.env['NETLIFY_EMAILS_SECRET'] || '',
    emailSender: process.env['EMAIL_SENDER'] || '',
    siteId: process.env['SITE_ID'] || '',
    apiKey: process.env['API_KEY_NETLIFY'] || '',
  },
};
