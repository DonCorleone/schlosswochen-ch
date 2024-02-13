import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
import {SeoService} from "./services/seo.service";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'schlosswochen-ch';

  constructor(private seoService: SeoService) {

    this.seoService.setDescription(
      'Schlosswochen - das Ferienangebot in Luzern für Kinder ab 5 Jahren. Auf dem Tribschenhorn in Luzern. Während den Sommerferien. Kinderbetreuung und Stärkung.', '/'
    );
    this.seoService.setTitle('Schlosswochen', '/');
  }
  ngOnInit() {
    registerLocaleData(localeDeCH, 'de-CH');
  }
}
