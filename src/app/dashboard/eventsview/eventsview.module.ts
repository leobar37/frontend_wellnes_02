import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsviewRoutingModule } from './eventsview-routing.module';
import { EventsviewComponent } from './eventsview.component';
import { ListeventsComponent } from './pages/listevents/listevents.component';
import { MatCardModule } from '@angular/material/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FlexLayoutModule } from '@angular/flex-layout';
// service provide of principal module events
import { EventService as EventServiceModule } from '../events/services/event.service';
import { DisplayeventComponent } from './pages/displayevent/displayevent.component';
import { EventService } from './services/event.service';
import { SesionService as PrincipalSesionService } from '../events/services/sesion.service';
import { DisplaySesionComponent } from './pages/display-sesion/display-sesion.component';
import { PipeShortParagraphModule } from '@core/pipes/short-paragraph.pipe';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
const zorro = [NzButtonModule, NzModalModule, NzSpaceModule, NzCardModule];
const material = [MatCardModule];

import { PlayerModule } from '@core/modules/player/player.module';

/* Masonry Library 
  documentation : https://github.com/wynfred/ngx-masonry/
 
*/
import { NgxMasonryModule } from 'ngx-masonry';
import { ItemSesionComponent } from './components/item-sesion/item-sesion.component';

@NgModule({
  declarations: [
    EventsviewComponent,
    ListeventsComponent,
    DisplayeventComponent,
    DisplaySesionComponent,
    ItemSesionComponent,
  ],
  imports: [
    CommonModule,
    EventsviewRoutingModule,
    ...zorro,
    ...material,
    FlexLayoutModule,
    PipeShortParagraphModule,
    NgxMasonryModule,
    PlayerModule,
  ],
  providers: [EventServiceModule, EventService, PrincipalSesionService],
})
export class EventsviewModule {}
