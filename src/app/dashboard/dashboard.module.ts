import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconsProviderModule } from './../icons-provider.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
const zorro = [NzMenuModule, NzLayoutModule];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    IconsProviderModule,
    FlexLayoutModule,
    CommonModule,
    zorro,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
