import {Component, Input, OnInit} from '@angular/core';
import {Week} from "../../../../models/content";

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html'
})
export class WeeksComponent {
  @Input() weeks: Week[] = [];
  @Input() hideToggle = false;
  @Input() showSwiper = false
  @Input() year = 0;

  weekNumber(index: number, week: Week):number {
    return week.number;
  };
}
