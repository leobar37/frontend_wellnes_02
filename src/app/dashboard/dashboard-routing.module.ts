import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const childrenRoutes: Routes = [
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'view',
    loadChildren: () =>
      import('./eventsview/eventsview.module').then((m) => m.EventsviewModule),
  },
  {
    path: 'apps',
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  },
];

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: childrenRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
