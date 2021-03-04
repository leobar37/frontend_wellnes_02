import { typID } from '@core/models/types';
import { IlistMessageItem, IRecentMessages } from './../../model';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
@Component({
  selector: 'app-chat-list-messages',
  template: `<cdk-virtual-scroll-viewport itemSize="3" class="list_chats">
    <app-chat-list-message-item
      [item]="item"
      *cdkVirtualFor="let item of items"
      (click)="eventClick(item.id_conversation)"
    >
    </app-chat-list-message-item>
  </cdk-virtual-scroll-viewport>`,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChatListMessagesComponent implements OnInit {
  @Input() items: IRecentMessages[];
  @Output() clickEvent = new EventEmitter<{ id: typID }>();
  constructor() {}
  ngOnInit(): void {
    // this.listService.updateLists(test);
  }
  eventClick(id: any) {
    this.clickEvent.next({ id: id });
  }
}
