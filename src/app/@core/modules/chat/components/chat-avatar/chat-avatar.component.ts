import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-avatar',
  template: `
    <div class="chat_card_avatar active">
      <div class="chat_card_avatar_badge">
        <span class="chat_card_avatar_badge_text"> +3 </span>
      </div>
      <img src="assets/img/jean.jpg" alt="" />
      <span class="chat_card_avatar_user"> Alfonso </span>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ChatAvatarComponent implements OnInit {
  constructor() {}

  @Input() _isSlide: boolean;

  get isSlide() {
    return this._isSlide ? this.isSlide : false;
  }
  ngOnInit(): void {}
}
