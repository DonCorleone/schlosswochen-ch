import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {Card, Content, Week} from '../../../../models/content';
import { ContentService } from '../../../../services/content.service';
import { EMPTY, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfigService } from '../../../../config/config.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  cards$: Observable<Card[] | undefined> = EMPTY;
  
  private contentService = inject(ContentService);
  private breakpointObserver = inject(BreakpointObserver);
  private configService = inject(ConfigService);
  
  private _ngDestroy$ = new Subject<void>();
  weeks: Week[] = [];
  year$: Observable<number | undefined> = EMPTY;

  ngOnInit(): void {

    this.contentService.content.pipe(
      takeUntil(this._ngDestroy$),
    ).subscribe( (x: Content[]) => {
      const cardsDef = x.find(
        (y) => y.title == 'impressionen'
      )?.cards;
      if (cardsDef) {
        const currentImpressions = cardsDef[0].impressions?.sort((a, b) => {
          return b.year - a.year;
        });
        if (currentImpressions && currentImpressions.length > 0) {
          // Sort weeks array inside each impression object
          currentImpressions.forEach(impression => {
            impression.weeks.sort((weekA, weekB) => weekA.number - weekB.number);
          });

          // Access the first impression after sorting
          const currentImpression = currentImpressions[0];

          console.log(currentImpression.weeks); // Sorted weeks array
          if (currentImpression) {
            this.year$ = of(currentImpression.year);
            this.weeks = currentImpression.weeks;
          }
        }
      }
    });

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
            const width = match?.length ? match[1] : '2048';

            this.cards$ = this.contentService.content.pipe(
              map((x) => {
                const cardsDef = x.find(
                  (y) => y._id == '629a212b215ee1a4bfe405e7'
                )?.cards;
                const cardsnew: Card[] = [];
                if (cardsDef) {
                  const config = this.configService.getConfig();
                  cardsDef.forEach((s) => {
                    cardsnew.push({
                      ...s,
                      imageUrl: `${config.baseUrl}${s.imageUrl}?nf_resize=fit&w=${width}`,
                    });
                  });
                }
                return cardsnew;
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
