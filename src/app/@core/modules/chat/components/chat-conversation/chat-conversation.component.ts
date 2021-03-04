import { IConversationItem, IMessage } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
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
  @Input() items: IMessage[] = [];

  ngOnInit(): void {}
}
