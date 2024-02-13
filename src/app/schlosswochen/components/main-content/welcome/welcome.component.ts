import { Component, OnDestroy, OnInit } from '@angular/core';
import {Card, Content, Week} from '../../../../models/content';
import { ContentService } from '../../../../services/content.service';
import { EMPTY, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit, OnDestroy {
  cards$: Observable<Card[] | undefined> = EMPTY;

  constructor(
    private contentService: ContentService,
    private breakpointObserver: BreakpointObserver
  ) {}
  private _ngDestroy$ = new Subject<void>();
  weeks$: Observable<Week[]> = EMPTY;
  year$: Observable<number | undefined> = EMPTY;

  ngOnInit(): void {

    this.contentService.content.pipe(
      takeUntil(this._ngDestroy$),
    ).subscribe( (x: Content[]) => {
      const cardsDef = x.find(
        (y) => y.title == 'impressionen'
      )?.cards;
      if (cardsDef) {
        const currentImpression = cardsDef[0].impressions?.sort((a, b) => {
          return b.year - a.year;
        })[0];

        if (currentImpression) {
          this.year$ = of(currentImpression.year);
          this.weeks$ = of(currentImpression.weeks);
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
                  cardsDef.forEach((s) => {
                    cardsnew.push({
                      ...s,
                      imageUrl: `${environment.URL}${s.imageUrl}?nf_resize=fit&w=${width}`,
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
