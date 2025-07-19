import {Component, Input, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Week} from "../../../../models/content";

@Component({
  selector: 'app-readonly-datepicker',
  templateUrl: './readonly-datepicker.component.html'
})
export class ReadonlyDatepickerComponent implements OnInit{

  @Input() week: Week | undefined;
  private initStart: Date | undefined;
  private initEnd: Date | undefined;

  ngOnInit(): void {
    this.initStart = this.week?.dateStart;
    this.initEnd = this.week?.dateEnd;
  }
  addEvent(type: string) {

    if (this.week){
      this.week.dateStart = this.initStart ?? new Date();
      this.week.dateEnd = this.initEnd ?? new Date();
    }
  }
}
