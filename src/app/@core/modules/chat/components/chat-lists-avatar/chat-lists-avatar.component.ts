import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-chat-lists-avatar',
  template: ` <div class="list_avatars">
    <swiper (S_INIT)="init($event)" [config]="config">
      <ng-content></ng-content>
    </swiper>
  </div>`,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ChatListsAvatarComponent implements OnInit {
  constructor() {}
  config: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true,
  };

  init($event) {
    console.log('init', $event);
  }
  ngOnInit(): void {}
}
