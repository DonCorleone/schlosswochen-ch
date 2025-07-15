// For SSR: Inject safe environment variables into the HTML
export function injectEnvironmentVariables(html: string): string {
  const googleMapsApiKey = process.env['API_KEY_GMAPS'] || '';
  
  // Only inject safe, non-sensitive variables
  const script = `
    <script>
      window.__GOOGLE_MAPS_API_KEY__ = '${googleMapsApiKey}';
      window.__APP_ENV__ = {
        production: ${process.env['NODE_ENV'] === 'production'},
        version: '1.0.0'
      };
    </script>
  `;
  
  return html.replace('</head>', `${script}</head>`);
}
