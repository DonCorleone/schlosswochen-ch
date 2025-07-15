import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  SecurityContext,
} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { SwiperModule } from './shared/swiper/swiper.module';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './schlosswochen/components/main-content/readonly-datepicker/custom-date-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { APP_CONFIG_PROVIDER } from './config/environment.factory';

import { register } from 'swiper/element/bundle';

const routes: Routes = [
  {
    path: 'schlosswochen',
    loadChildren: () =>
      import('./schlosswochen/schlosswochen.module').then(
        (m) => m.SchlosswochenModule
      ),
  },
  { path: '**', redirectTo: 'schlosswochen' },
];

// function that returns `MarkedOptions` with renderer override ..
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.paragraph = (text: string) => {
    return '<p class="color-red">' + text + '</p>';
  };

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
    }),
    HttpClientJsonpModule,
  ],
  providers: [
    provideClientHydration(),
    APP_CONFIG_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
