import { interval } from 'rxjs';
import { IConversationItem, IMessage } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-conversation',
  template: `
    <cdk-virtual-scroll-viewport
      itemSize="3"
      class="chat-card_list_conversation"
      #virtualScroll
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
export class ChatConversationComponent implements OnInit, OnChanges {
  @ViewChild('virtualScroll', { static: true })
  refScroll: CdkVirtualScrollViewport;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('all changues');
    console.log(changes);

    if (changes?.items) {
      console.log('here');
      setTimeout(() => {
        this.refScroll.scrollTo({
          bottom: 0,
          behavior: 'auto'
        });
      }, 5);
    }
  }

  @Input() items: IMessage[] = [];

  ngOnInit(): void {}
}
