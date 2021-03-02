import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-list-message-item',
  template: `
    <div class="list_chats_item">
      <!-- avatar -->
      <app-chat-avatar></app-chat-avatar>
      <div class="list_chats_item_text">
        <h3 class="subtitle">Martin Jimenenez</h3>
        <p class="paragraph">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda
        </p>
      </div>
      <div class="list_chats_item_actions">
        <span> 16:04 </span>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ChatListMessageItemComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
