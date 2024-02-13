import {Component, Input, OnInit} from '@angular/core';
import {Week} from "../../../../models/content";

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html'
})
export class WeeksComponent  implements OnInit{
  @Input() weeks: Week[] = [];
  @Input() hideToggle = false;
  @Input() showSwiper = false
  @Input() year = 0;

  ngOnInit(): void {
    if (this.weeks.length > 0) {
      this.weeks.sort((a, b) => {
        return b.number - a.number;
      });
    }
  }

}
