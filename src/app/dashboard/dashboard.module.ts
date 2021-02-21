import { SidebarService } from './services/sidebar.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconsProviderModule } from './../icons-provider.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
// ads component
import { AlertModule } from '@core/modules/alert/alert.module';
const zorro = [NzMenuModule, NzLayoutModule, NzBreadCrumbModule, AlertModule];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    IconsProviderModule,
    FlexLayoutModule,
    CommonModule,
    zorro,
    DashboardRoutingModule,
  ],
  providers: [SidebarService],
})
export class DashboardModule {}
