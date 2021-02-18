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
      name: 'cuenta',
      icon: 'user',
      items: [
        { name: 'Perfil', route: 'account/profile', icon: 'user' },
        { name: 'Referidos', route: 'account/referreals', icon: 'user' },
      ],
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
        { name: 'Agregar Evento', route: 'events' },
        {
          name: 'Lista de eventos',
          route: 'events/list/event',
        },
      ],
    },
    {
      name: 'Administrar Programas',
      icon: 'profile',
      items: [
        { name: 'Agregar Programa', route: 'events/program' },
        {
          name: 'Lista de Programas',
          route: 'events/list/program',
        },
      ],
    },
    {
      name: 'Eventos',
      icon: 'profile',
      items: [
        {
          name: 'Eventos',
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
