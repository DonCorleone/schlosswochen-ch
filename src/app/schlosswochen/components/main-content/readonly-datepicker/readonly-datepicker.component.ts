import {Component, Input, OnInit} from '@angular/core';
import {DateRange, ExtractDateTypeFromSelection, MatDatepickerInputEvent} from "@angular/material/datepicker";
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

  addEvent(input: string, $event: MatDatepickerInputEvent<ExtractDateTypeFromSelection<DateRange<any>>, DateRange<any>>) {
    if (this.week){
      this.week.dateStart = this.initStart ?? new Date();
      this.week.dateEnd = this.initEnd ?? new Date();
    }
  }
}
