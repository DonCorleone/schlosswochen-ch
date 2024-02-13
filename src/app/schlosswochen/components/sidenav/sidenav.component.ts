import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { EMPTY, Observable, Subject, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ContentService } from '../../../services/content.service';
import { Content } from '../../../models/content';
import { Router, RouterLink } from '@angular/router';

const SMALL_WIDTH_BREAKPOINT = 768;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean = false;
  private _ngDestroy$ = new Subject<void>();
  content$: Observable<Content[]> = EMPTY;

  @ViewChild(MatSidenav) sideNav: MatSidenav | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private contentService: ContentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`])
      .pipe(takeUntil(this._ngDestroy$))
      .subscribe((state: BreakpointState) => {
        this.isScreenSmall = state.matches;
      });

    this.content$ = this.contentService.content;
    this.contentService.loadAll();

    // this.content$.subscribe((data) => console.log(data));

    this.router.events.pipe(takeUntil(this._ngDestroy$)).subscribe((event) => {
      if (this.isScreenSmall) {
        this.sideNav?.close();
      }
    });
  }

  ngOnDestroy() {
    this._ngDestroy$.next();
    this._ngDestroy$.complete();
  }
}
