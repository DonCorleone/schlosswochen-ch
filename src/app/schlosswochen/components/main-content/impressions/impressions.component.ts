import { Component, Input, OnInit } from '@angular/core';
import { Card, Impression } from '../../../../models/content';
import { yearsPerPage } from '@angular/material/datepicker';

@Component({
  selector: 'app-impressions',
  templateUrl: './impressions.component.html'
})
export class ImpressionsComponent implements OnInit {

  @Input() card: Card | undefined;
  impressions: Impression[] | undefined;

  ngOnInit(): void {
    if (this.card) {
      this.impressions = this.card.impressions?.sort((a, b) => {
        return b.year - a.year;
      }).filter(x => new Date(x.weeks[0].dateStart) < new Date())
    }
  }
}
