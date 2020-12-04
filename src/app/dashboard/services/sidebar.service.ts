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
    { name: 'Perfil', route: 'profile', icon: 'user' },
    {
      name: 'events',
      icon: 'profile',
      items: [
        { name: 'Crear evento', route: 'events' },
        {
          name: 'sesion',
          route: 'events/sesion',
        },
      ],
    },
  ];
  constructor() {}

  get getSidebar() {
    return this.data;
  }
}
