import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  listAssets(path: string): Observable<Netlifile[]> {
    const config = this.configService.getConfig();
    
    return this.http
      .get<Netlifile[]>(`${config.apiUrl}/get-assets?path=${encodeURIComponent(path)}`)
      .pipe(
        map((response: Netlifile[]) => {
          return response.filter((x) => x.type === 'file');
        })
      );
  }

  shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}

export interface Netlifile {
  id: string;
  path: string;
  sha: string;
  mime_type: string;
  size: number;
  site_id: string;
  deploy_id: string;
  type: string; // Added this property for type checking
}

/*  downloadAll(): void {
    this.downloadImages('');
  }

  downloadImages(folder: string){
    this.http.get<Image4Response>(
      environment.API_URL_IMAGE4IO + `/listFolder?path=${folder ?? '/' }`,
      this.httpOptions
    ).subscribe( p => {
      p.folders.forEach(folder => {
        this.downloadImages(folder.path);
      });

      p.images.forEach (i => {
        this.download(i.url).subscribe(blob => {
          this.createFile(blob, i.imagePath);
        });
      })
    })
  }

  createFile(res: Blob, title: string){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(res);
    a.download = title;
    document.body.appendChild(a);
    a.click();
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }*/
