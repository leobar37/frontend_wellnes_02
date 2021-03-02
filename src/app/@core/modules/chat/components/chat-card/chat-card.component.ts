import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatCardComponent implements OnInit, OnChanges {
  config: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true,
  };
  constructor() {
    console.log('init components');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('chagues');
  }
  init($event) {
    console.log('init', $event);
  }
  ngOnInit(): void {}
  initialized($event) {}
}
