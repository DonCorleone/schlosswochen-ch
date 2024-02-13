import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, take } from 'rxjs';
import { Content } from '../models/content';

export interface GetContentResponse {
  message: Content[];
}

@Injectable()
export class ContentService {
  private _content: BehaviorSubject<Content[]>;

  private dataStore: {
    content: Content[];
  };

  constructor(private http: HttpClient) {
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

    //getter
    this.http
      .get<GetContentResponse>('/.netlify/functions/get-content', {})
      .pipe(
        take(1),
        map((data: GetContentResponse) => {

          this.dataStore.content = data.message;
          this._content.next(Object.assign({}, this.dataStore).content);
        }),
        catchError((err) => {
          throw 'error in source. Details: ' + err;
        })
      )
      .subscribe();
  }
}
