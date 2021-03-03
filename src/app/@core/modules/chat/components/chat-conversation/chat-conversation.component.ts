import { IConversationItem } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-chat-conversation',
  template: `
    <cdk-virtual-scroll-viewport
      itemSize="3"
      class="chat-card_list_conversation"
    >
      <app-chat-message
        [item]="item"
        *cdkVirtualFor="let item of items"
      ></app-chat-message>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatConversationComponent implements OnInit {
  constructor() {}
  items: IConversationItem[] = [
    {
      reverse: false,
      name: 'Jorge',
      message: 'Hello Bro',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    },
    {
      reverse: true,
      name: 'Jorge',
      message: 'Hola wenas necesito informacion de los planes',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    },
    {
      reverse: false,
      name: 'Jorge',
      message: 'Claro mi bro, ¿Cuentame cual es tu objetivo?',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    },
    {
      reverse: true,
      name: 'Jorge',
      message: 'Perder grasa bro',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    },
    {
      reverse: false,
      name: 'Jorge',
      message: 'Ahora te comunico con un asesor',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    },
    {
      reverse: true,
      name: 'Jorge',
      message: 'Gracias bro',
      avatar: {
        avatar: 'assets/img/jean.jpg'
      },
      time: new Date()
    }
  ];

  ngOnInit(): void {}
}
