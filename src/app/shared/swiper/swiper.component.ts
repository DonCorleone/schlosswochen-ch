import {Component, Input, OnDestroy, OnInit, inject} from '@angular/core';
import {EMPTY, map, Observable, Subject, takeUntil} from 'rxjs';
import {ImagesService, Netlifile} from '../../services/images.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ConfigService} from '../../config/config.service';
import {AutoplayOptions} from 'swiper/types';
import {SwiperDirective} from "../../schlosswochen/directives/swiper.directive";
import {SwiperContainer} from "swiper/element";
import {SwiperOptions} from "swiper/types";

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
})
export class SwiperComponent implements OnInit, OnDestroy {
  letsgo(filePath: string) {
    // remove the trailing ?nf_resize=fit&w=* from the path
    filePath = filePath.replace(/\?nf_resize=fit&w=\d+$/, '');
    // open a new tab with the image
    window.open(filePath, '_blank');
  }

  @Input() week: number = -1;
  @Input() year: number = -1;
  @Input() autoplay: AutoplayOptions | undefined;

  config: SwiperOptions = {};
  width = 0;
  height = 0;

  files$: Observable<Netlifile[]> = EMPTY;

  private _ngDestroy$ = new Subject<void>();
  
  private imageService = inject(ImagesService);
  private breakpointObserver = inject(BreakpointObserver);
  private configService = inject(ConfigService);

  ngOnInit(): void {
    this.config = {
      autoplay: this.autoplay ?? false,
      pagination: this.autoplay
        ? false
        : {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      spaceBetween: 30,
      zoom: true,
    };
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this._ngDestroy$))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            const match = query.match('\\(max-width:\\s(\\d+)\\.98px\\)');
            this.width = +(match?.length ? match[1] : '2048');
            this.height = 3 / 4 * this.width;

            this.files$ = this.imageService
              .listAssets(`/assets/images/${this.year}-${this.week}`)
              .pipe(
                map((p) => {
                  const config = this.configService.getConfig();
                  p.forEach(
                    (image) =>
                      (image.path = `${config.baseUrl}${image.path}?nf_resize=fit&w=${this.width}`)
                  );
                  return p;
                })
              );
            break;
          }
        }
      });
  }

  ngOnDestroy() {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }
}
