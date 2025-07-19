import { Component, Input, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RuntimeConfigService } from '../../../../services/runtime-config.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit {
  zoom = 15;
  center: google.maps.LatLngLiteral = {
    lat: 47.0417285,
    lng: 8.3260751
  };
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };

  markers = [{
    position: {
      lat: 47.0417285,
      lng: 8.3260751,
    },
    title: 'Pavillon Tribschenhorn - Schlosswochen Luzern',
    options: {
      draggable: false,
    },
  }];

  showMap = false;
  private runtimeConfigService = inject(RuntimeConfigService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Only load Google Maps in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsScript();
    }
  }

  private loadGoogleMapsScript(): void {
    // Double-check browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      this.showMap = true;
      return;
    }

    const apiKey = this.runtimeConfigService.getGoogleMapsApiKey();
    if (!apiKey) {
      console.warn('Google Maps API key not available');
      return;
    }

    // Load the script in a way that's compatible with Angular Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initGoogleMaps`;
    
    // Create global callback
    (window as any).initGoogleMaps = () => {
      this.showMap = true;
      delete (window as any).initGoogleMaps;
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
    };

    document.head.appendChild(script);
  }

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
