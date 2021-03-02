import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-list-messages',
  template: ` <div class="list_chats">
    <ng-content></ng-content>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ChatListMessagesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
