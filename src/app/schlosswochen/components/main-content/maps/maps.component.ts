import { Component, Input, OnInit, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from '../../../../services/runtime-config.service';

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
    mapId: '262b6f139ce6cbee8c164b15', // Required for Advanced Markers
  };

  markers: any[] = [];
  apiLoaded: Observable<boolean>;

  private httpClient = inject(HttpClient);
  private runtimeConfigService = inject(RuntimeConfigService);

  constructor() {
    const apiKey = this.runtimeConfigService.getGoogleMapsApiKey();
    
    if (!apiKey) {
      console.warn('Google Maps API key not available, maps component will not load');
      this.apiLoaded = of(false);
      return;
    }
    
    this.apiLoaded = this.httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker`,
        'callback'
      )
      .pipe(
        map(() => {
          this.markers.push({
            position: {
              lat: 47.0417285,
              lng: 8.3260751,
            },
            title: 'Pavillon Tribschenhorn - Schlosswochen Luzern',
            options: {
              // Advanced marker options
              gmpDraggable: false,
            },
          });
          return true;
        }),
        catchError((error) => {
          console.error('Failed to load Google Maps API:', error);
          return of(false);
        })
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
