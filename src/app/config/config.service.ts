import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { APP_CONFIG, AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = inject(APP_CONFIG);
  private http = inject(HttpClient);

  getConfig(): AppConfig {
    return this.config;
  }

  // For runtime config loading (if needed)
  loadRuntimeConfig(): Observable<Partial<AppConfig>> {
    // This could fetch runtime config from your backend
    return of({});
  }
}
