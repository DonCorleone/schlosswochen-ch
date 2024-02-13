import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SwiperComponent} from './swiper.component';
import {MatIconModule} from '@angular/material/icon';
import {SwiperDirective} from 'src/app/schlosswochen/directives/swiper.directive';
import {register} from 'swiper/element/bundle';

register();

@NgModule({
  declarations: [SwiperComponent],
  imports: [CommonModule, MatIconModule, NgOptimizedImage, SwiperDirective],
  exports: [SwiperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperModule {
}
