import { ERol } from 'src/app/services/rol.service';
import { Injectable } from '@angular/core';

export interface Imenu {
  name: string;
  route?: string;
  items?: Imenu[];
  icon?: string;
  roles?: ERol[];
}
@Injectable()
export class SidebarService {
  data: Imenu[] = [
    {
      name: 'cuenta',
      icon: 'user',
      roles: [ERol.USER, ERol.ADMIN],
      items: [
        { name: 'Perfil', route: 'account/profile', icon: 'user' },
        { name: 'Referidos', route: 'account/referreals', icon: 'user' }
      ]
    },
    {
      name: 'Control de usuarios',
      icon: 'user',
      route: 'ctrlus',
      roles: [ERol.ADMIN, ERol.ASESOR],
      items: [
        { name: 'Usuarios', route: 'ctrlus/list' },
        { name: 'Solictitudes', route: 'ctrlus/request' }
      ]
    },
    {
      name: 'apps',
      route: 'calendar',
      roles: [ERol.USER, ERol.CREATOR, ERol.ADMIN],
      icon: 'appstore',
      items: [{ name: 'calendario', route: 'apps/calendar' }]
    },
    {
      name: 'Administrar Eventos',
      icon: 'profile',
      roles: [ERol.CREATOR, ERol.ADMIN],
      items: [
        { name: 'Agregar Evento', route: 'events' },
        {
          name: 'Lista de eventos',
          route: 'events/list/event'
        }
      ]
    },
    {
      name: 'Administrar Programas',
      icon: 'profile',
      roles: [ERol.CREATOR, ERol.ADMIN],
      items: [
        { name: 'Agregar Programa', route: 'events/program' },
        {
          name: 'Lista de Programas',
          route: 'events/list/program'
        }
      ]
    },
    {
      name: 'Categorias',
      icon: 'bars',
      route: 'categorie',
      roles: [ERol.ADMIN]
    }
  ];
  constructor() {}

  get getSidebar() {
    return this.data;
  }
}
