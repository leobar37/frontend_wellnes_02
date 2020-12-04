import { EventService } from './services/event.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HandleeventComponent } from './pages/handleevent/handleevent.component';
import { HandlesesionComponent } from './pages/handlesesion/handlesesion.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { NzModalModule } from 'ng-zorro-antd/modal';
const zorro = [
  NzModalModule,
  NzButtonModule,
  NzUploadModule,
  NzMessageModule,
  NzListModule,
  NzCardModule,
  NzCheckboxModule,
  NzFormModule,
  NzSwitchModule,
  NzDatePickerModule,
  NzInputModule,
  NzTimePickerModule,
];
@NgModule({
  declarations: [EventsComponent, HandleeventComponent, HandlesesionComponent],
  imports: [
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    EventsRoutingModule,
    zorro,
  ],
  providers: [EventService],
})
export class EventsModule {}
