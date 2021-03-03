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
        [reverse]="eve"
        *cdkVirtualFor="let item of [1, 2, 3, 4, 5, 6]; let eve = even"
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

  ngOnInit(): void {}
}
