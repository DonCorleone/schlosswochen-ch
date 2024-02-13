import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { Content } from '../../../models/content';
import { ContentService } from '../../../services/content.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styles: [
    `
                                          markdown > p {
                                            display: flex;
                                            flex-direction: column;
                                          }
                                        `,
  ],
})
export class MainContentComponent implements OnInit, OnDestroy {
  content: Content | undefined = undefined;
  _ngDestroy$: Subject<void> = new Subject();

  constructor(
    private router: ActivatedRoute,
    private contentService: ContentService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.router.params
      .pipe(
        map((p) => p['title']),
        takeUntil(this._ngDestroy$)
      )
      .subscribe((title: string) => {
        this.content = undefined;
        if (!title) {
          this.content = {
            title: '',
            description: '',
            text: '',
            _id: 'hello',
            sortorder: 0,
            active: true,
            gallery: '',
            markdown: '',
            cards: undefined,
          };
          return;
        }

        this.seoService.setDescription(
          'Schlosswochen - das Ferienangebot in Luzern für Kinder ab 5 Jahren. Auf dem Tribschenhorn in Luzern. Während den Sommerferien. Kinderbetreuung und Stärkung.',
          title
        );
        this.seoService.setTitle('Schlosswochen', title);

        setTimeout(() => {
          this.contentService.content.subscribe((content) => {
            if (content.length == 0) return;
            setTimeout(() => {
              this.content = this.contentService.contentByTitle(title);
              this.content?.cards?.forEach((c) => {
                c.impressions?.forEach((i) => {
                  console.log('year ' + i.year);

                  i.weeks.forEach((w) => {
                    // calculate the number of weeks
                    const dateStart = new Date(w.dateStart);
                    const dateEnd = new Date(w.dateEnd);
                    const diffTime = Math.abs(
                      dateEnd.getTime() - dateStart.getTime()
                    );
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    const weeknumber = Math.ceil(diffDays / 7);

                    console.log('weeknumber ' + weeknumber);
                  });
                });
              });
            }, 200);
          });
        });
      });
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }
}
