import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface AppConfig {
  googleMapsApiKey: string;
  environment: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private configSubject = new BehaviorSubject<AppConfig | null>(null);
  private configCache$: Observable<AppConfig> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Load configuration from Netlify function
   * This is called once during app initialization
   */
  loadConfig(): Observable<AppConfig> {
    if (this.configCache$) {
      return this.configCache$;
    }

    // During SSR/prerendering, return fallback config immediately
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR detected - using fallback configuration');
      const fallbackConfig: AppConfig = {
        googleMapsApiKey: '',
        environment: 'production',
        version: '1.0.0'
      };
      this.configSubject.next(fallbackConfig);
      this.configCache$ = of(fallbackConfig).pipe(shareReplay(1));
      return this.configCache$;
    }

    this.configCache$ = this.http.get<AppConfig>('/.netlify/functions/get-config').pipe(
      map((config) => {
        console.log('Configuration loaded:', {
          hasGoogleMapsKey: !!config.googleMapsApiKey,
          googleMapsKeyLength: config.googleMapsApiKey?.length || 0,
          environment: config.environment
        });
        this.configSubject.next(config);
        return config;
      }),
      catchError((error) => {
        console.error('Failed to load runtime configuration:', error);
        // Fallback configuration
        const fallbackConfig: AppConfig = {
          googleMapsApiKey: '',
          environment: 'production',
          version: '1.0.0'
        };
        this.configSubject.next(fallbackConfig);
        return of(fallbackConfig);
      }),
      shareReplay(1)
    );

    return this.configCache$;
  }

  /**
   * Get current configuration (synchronous)
   */
  getConfig(): AppConfig | null {
    return this.configSubject.value;
  }

  /**
   * Get configuration as observable
   */
  getConfig$(): Observable<AppConfig | null> {
    return this.configSubject.asObservable();
  }

  /**
   * Get Google Maps API key
   */
  getGoogleMapsApiKey(): string {
    const config = this.getConfig();
    return config?.googleMapsApiKey || '';
  }
}
