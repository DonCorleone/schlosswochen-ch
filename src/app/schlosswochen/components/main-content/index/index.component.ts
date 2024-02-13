import {Component} from '@angular/core';
import {Content} from '../../../../models/content';
import {map, Observable} from 'rxjs';
import {ContentService} from '../../../../services/content.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
    `
      div div:last-child mat-divider {
        display: none;
      }
      .mat-list-item.active {
        background-color: red;
      }
    `,
  ],
})
export class IndexComponent {
  content$: Observable<Content[]> = this.contentService.content.pipe(
    map(x => x.filter(p => p.active))
  );

  constructor(private contentService: ContentService) {
  }
  identify(index: number, item: Content){
    return item._id;
  }
}
