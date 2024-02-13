import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Card} from "../../../../models/content";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsComponent {
  @Input() card: Card | undefined;
}
