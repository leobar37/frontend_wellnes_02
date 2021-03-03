import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';
@Component({
  selector: 'app-chat-message',
  template: `
    <li
      class="chat-card_list_conversation_item"
      [ngClass]="{ reverse: reverse }"
    >
      <app-chat-avatar
        *ngIf="!reverse"
        class="avatar"
        [avatar]="'assets/img/jean.jpg'"
      ></app-chat-avatar>
      <div class="context">
        <h3 *ngIf="!reverse" class="subtitle">Martinez</h3>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint, dicta.
        </p>
        <span> 14:09 </span>
      </div>
    </li>
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
export class MessageComponent implements OnInit {
  @Input() @InputBoolean() reverse: boolean;
  constructor() {}

  ngOnInit(): void {
    console.log(this.reverse);
  }
}
