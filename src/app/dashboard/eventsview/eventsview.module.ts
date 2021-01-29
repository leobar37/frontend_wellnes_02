import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsviewRoutingModule } from './eventsview-routing.module';
import { EventsviewComponent } from './eventsview.component';
import { ListeventsComponent } from './pages/listevents/listevents.component';
import { MatCardModule } from '@angular/material/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventService } from '../events/services/event.service';
import { DisplayeventComponent } from './pages/displayevent/displayevent.component';
const zorro = [NzButtonModule];

const material = [MatCardModule];
@NgModule({
  declarations: [EventsviewComponent, ListeventsComponent, DisplayeventComponent],
  imports: [
    CommonModule,
    EventsviewRoutingModule,
    ...zorro,
    ...material,
    FlexLayoutModule,
  ],
  providers: [EventService],
})
export class EventsviewModule {}
