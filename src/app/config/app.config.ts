import { InjectionToken } from '@angular/core';

export interface AppConfig {
  production: boolean;
  apiUrl: string;
  googleMapsApiKey: string;
  appName: string;
  version: string;
  baseUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
