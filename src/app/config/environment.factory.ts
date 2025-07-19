import { APP_CONFIG, AppConfig } from '../config/app.config';
import { RuntimeConfigService } from '../services/runtime-config.service';
import { PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function createAppConfig(runtimeConfigService?: RuntimeConfigService, platformId?: Object): AppConfig {
  // For SSR, return minimal config immediately
  if (platformId && !isPlatformBrowser(platformId)) {
    return {
      production: false,
      apiUrl: '/.netlify/functions',
      googleMapsApiKey: '',
      appName: 'Schlosswochen',
      version: '1.0.0',
      baseUrl: '',
    };
  }

  // Safe way to access environment variables in the browser
  const isProduction = isPlatformBrowser(platformId || '') 
    ? (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    : false;

  const baseUrl = isPlatformBrowser(platformId || '') && typeof window !== 'undefined'
    ? window.location.origin
    : '';

  return {
    production: isProduction,
    apiUrl: '/.netlify/functions',
    googleMapsApiKey: getGoogleMapsApiKey(runtimeConfigService, platformId),
    appName: 'Schlosswochen',
    version: '1.0.0',
    baseUrl: baseUrl,
  };
}

function getGoogleMapsApiKey(runtimeConfigService?: RuntimeConfigService, platformId?: Object): string {
  // Only try to get API key in browser environment
  if (!isPlatformBrowser(platformId || '')) {
    return ''; // Return empty string during SSR
  }

  // Try to get from runtime config service first
  if (runtimeConfigService) {
    const apiKey = runtimeConfigService.getGoogleMapsApiKey();
    if (apiKey) {
      return apiKey;
    }
  }

  // Fallback to window injection (for development or legacy support)
  if (typeof window !== 'undefined' && (window as any).__GOOGLE_MAPS_API_KEY__) {
    return (window as any).__GOOGLE_MAPS_API_KEY__;
  }
  
  return ''; // Final fallback
}

export const APP_CONFIG_PROVIDER = {
  provide: APP_CONFIG,
  useFactory: createAppConfig,
  deps: [[new Optional(), RuntimeConfigService], PLATFORM_ID]
};
