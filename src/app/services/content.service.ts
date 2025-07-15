import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, take } from 'rxjs';
import { Content } from '../models/content';
import { ConfigService } from '../config/config.service';

export interface GetContentResponse {
  message: Content[];
}

@Injectable()
export class ContentService {
  private _content: BehaviorSubject<Content[]>;
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

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
          throw 'error in source. Details: ' + err;
        })
      )
      .subscribe();
  }
}
