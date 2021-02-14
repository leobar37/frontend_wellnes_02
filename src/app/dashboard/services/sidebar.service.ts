import { Injectable } from '@angular/core';

export interface Imenu {
  name: string;
  route?: string;
  items?: Imenu[];
  icon?: string;
}
@Injectable()
export class SidebarService {
  data: Imenu[] = [
    {
      name: 'Perfil',
      route: 'profile',
      icon: 'user',
    },
    {
      name: 'apps',
      route: 'calendar',
      icon: 'appstore',
      items: [{ name: 'calendario', route: 'apps/calendar' }],
    },
    {
      name: 'Administrar Eventos',
      icon: 'profile',
      items: [
        { name: 'Crear evento', route: 'events' },
        {
          name: 'eventos creados',
          route: 'events/list',
        },
      ],
    },
    {
      name: 'Eventos',
      icon: 'profile',
      items: [
        {
          name: 'explorar eventos',
          route: 'view/explorer',
        },
      ],
    },
  ];
  constructor() {}

  get getSidebar() {
    return this.data;
  }
}
