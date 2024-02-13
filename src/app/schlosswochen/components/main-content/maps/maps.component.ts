import { Component, Input, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit {
  zoom = 15;
  center: google.maps.LatLngLiteral = new (class
    implements google.maps.LatLngLiteral
  {
    lat = 47.0417285;
    lng = 8.3260751;
  })();
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };

  markers: any[] = [];
  apiLoaded: Observable<boolean>;

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.API_KEY_GMAPS}`,
        'callback'
      )
      .pipe(
        map(() => {
          this.markers.push({
            position: {
              lat: 47.0417285,
              lng: 8.3260751,
            },
            title: 'Marker title ' + (this.markers.length + 1),
            options: { animation: google.maps.Animation.DROP },
          });
          return true;
        }),
        catchError(() => of(false))
      );
  }
  ngOnInit(): void {}
  zoomIn() {
    if (!this.options || !this.options.maxZoom) {
      return;
    }
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (!this.options || !this.options.minZoom) {
      return;
    }
    if (this.zoom > this.options.minZoom) this.zoom--;
  }
}
