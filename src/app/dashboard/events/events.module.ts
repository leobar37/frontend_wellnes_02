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
const zorro = [
  NzButtonModule,
  NzUploadModule,
  NzCardModule,
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
    // ReactiveFormsModule,
    CommonModule,
    EventsRoutingModule,
    zorro,
  ],
})
export class EventsModule {}
