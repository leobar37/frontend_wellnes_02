import { NotificationsModule } from './components/notifications/notifications.module';
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
import { NavbarComponent } from './components/navbar/navbar.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

import { NzIconModule } from 'ng-zorro-antd/icon';

// chat module

import { ChatModule } from '@core/modules/chat/chat.module';

const zorro = [
  NzMenuModule,
  NzDropDownModule,
  NzLayoutModule,
  NzBreadCrumbModule,
  AlertModule,
  NzBadgeModule,
  NzCardModule,
  NzAvatarModule,
  NzIconModule,
];

const me = [ChatModule];

@NgModule({
  declarations: [DashboardComponent, NavbarComponent],
  imports: [
    IconsProviderModule,
    FlexLayoutModule,
    CommonModule,
    zorro,
    ...me,
    NotificationsModule,
    DashboardRoutingModule,
  ],
  providers: [SidebarService],
})
export class DashboardModule {}
