import { APP_CONFIG, AppConfig } from '../config/app.config';

export function createAppConfig(): AppConfig {
  // Safe way to access environment variables in the browser
  const isProduction = typeof window !== 'undefined' 
    ? window.location.hostname !== 'localhost'
    : false;

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : '';

  return {
    production: isProduction,
    apiUrl: '/.netlify/functions',
    googleMapsApiKey: getGoogleMapsApiKey(),
    appName: 'Schlosswochen',
    version: '1.0.0',
    baseUrl: baseUrl,
  };
}

function getGoogleMapsApiKey(): string {
  // This will be injected by the server during SSR
  if (typeof window !== 'undefined' && (window as any).__GOOGLE_MAPS_API_KEY__) {
    return (window as any).__GOOGLE_MAPS_API_KEY__;
  }
  return ''; // Fallback for development
}

export const APP_CONFIG_PROVIDER = {
  provide: APP_CONFIG,
  useFactory: createAppConfig,
};
