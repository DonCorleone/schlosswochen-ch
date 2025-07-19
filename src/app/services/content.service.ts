import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, take, of } from 'rxjs';
import { Content } from '../models/content';
import { ConfigService } from '../config/config.service';
import { isPlatformBrowser } from '@angular/common';

export interface GetContentResponse {
  message: Content[];
}

@Injectable()
export class ContentService {
  private _content: BehaviorSubject<Content[]>;
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private platformId = inject(PLATFORM_ID);

  private dataStore: {
    content: Content[];
  };

  constructor() {
    this.dataStore = { content: [] };
    this._content = new BehaviorSubject<Content[]>([]);
  }

  get content(): Observable<Content[]> {
    return this._content.asObservable();
  }

  contentByTitle(title: string): Content | undefined {
    return this.dataStore.content.find((x) => x.title == title);
  }

  loadAll() {
    // Skip HTTP calls during SSR/prerendering
    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR detected - skipping content loading');
      return;
    }

    const config = this.configService.getConfig();
    
    this.http
      .get<GetContentResponse>(`${config.apiUrl}/get-content`, {})
      .pipe(
        take(1),
        map((data: GetContentResponse) => {
          this.dataStore.content = data.message;
          this._content.next(Object.assign({}, this.dataStore).content);
        }),
        catchError((err) => {
          console.error('Error loading content:', err);
          // Return empty content instead of throwing during SSR
          return of([]);
        })
      )
      .subscribe();
  }
}
