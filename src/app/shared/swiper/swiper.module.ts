import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SwiperComponent} from './swiper.component';
import {MatIconModule} from '@angular/material/icon';
import {SwiperDirective} from 'src/app/schlosswochen/directives/swiper.directive';

// Only register Swiper in browser environment
if (typeof window !== 'undefined') {
  import('swiper/element/bundle').then(({ register }) => {
    register();
  });
}

@NgModule({
  declarations: [SwiperComponent],
  imports: [CommonModule, MatIconModule, NgOptimizedImage, SwiperDirective],
  exports: [SwiperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperModule {
}
