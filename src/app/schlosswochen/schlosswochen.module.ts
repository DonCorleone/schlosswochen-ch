import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchlosswochenAppComponent } from './schlosswochen-app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MarkdownModule } from 'ngx-markdown';
import { ContentService } from '../services/content.service';
import { MatIconRegistry } from '@angular/material/icon';
import { ImpressionsComponent } from './components/main-content/impressions/impressions.component';
import { DateAdapter, MAT_DATE_LOCALE, MatRippleModule} from '@angular/material/core';
import { SharedModule } from '../shared/shared.module';
import { ReadonlyDatepickerComponent } from './components/main-content/readonly-datepicker/readonly-datepicker.component';
import { CustomDateAdapter } from './components/main-content/readonly-datepicker/custom-date-adapter';
import { SwiperModule } from '../shared/swiper/swiper.module';
import { CardComponent } from './components/main-content/card/card.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './components/main-content/maps/maps.component';
import { IndexComponent } from './components/main-content/index/index.component';
import { WelcomeComponent } from './components/main-content/welcome/welcome.component';
import { WeeksComponent } from './components/main-content/weeks/weeks.component';
import { ButtonsComponent } from "./components/main-content/buttons/buttons.component";
import { SubscribeComponent } from './components/main-content/subscribe/subscribe.component';

const routes: Routes = [
  {
    path: '',
    component: SchlosswochenAppComponent,
    children: [
      {
        path: ':title',
        component: MainContentComponent,
      },
      {
        path: '',
        component: MainContentComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/schlosswochen' },
];

@NgModule({
  declarations: [
    SchlosswochenAppComponent,
    ToolbarComponent,
    MainContentComponent,
    SidenavComponent,
    ImpressionsComponent,
    ReadonlyDatepickerComponent,
    CardComponent,
    MapsComponent,
    IndexComponent,
    WelcomeComponent,
    WeeksComponent,
    ButtonsComponent,
    SubscribeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
    SwiperModule,
    GoogleMapsModule,
  ],
  providers: [
    ContentService,
    MatIconRegistry,
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class SchlosswochenModule {}
