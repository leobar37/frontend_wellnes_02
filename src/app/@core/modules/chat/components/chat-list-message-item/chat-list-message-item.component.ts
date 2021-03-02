import { IlistMessageItem } from './../../model';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-chat-list-message-item',
  template: `
    <div class="list_chats_item">
      <!-- avatar -->
      <app-chat-avatar
        [active]="item.avatar.active"
        [count]="item.avatar.notifications"
        [avatar]="item.avatar.avatar"
      ></app-chat-avatar>
      <div class="list_chats_item_text">
        <h3 class="subtitle">{{ item.name }}</h3>
        <p class="paragraph">
          {{ item.message }}
        </p>
      </div>
      <div class="list_chats_item_actions">
        <span> {{ item.time | date: 'mm:ss' }}</span>
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatListMessageItemComponent implements OnInit {
  constructor() {}

  @Input() item: IlistMessageItem;

  ngOnInit(): void {}
}
