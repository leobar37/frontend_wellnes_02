import { typID } from '@core/models/types';
import { IlistMessageItem } from './../../model';
import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatCardComponent implements OnInit, OnChanges {
  test = [
    {
      id: 1,
      name: 'Joselito',
      message: 'Lorem ipsum dolor sit amet',
      avatar: {
        active: true,
        notifications: 5
      },
      time: new Date()
    },
    {
      id: 2,
      name: 'Joselito',
      message: 'Lorem ipsum dolor sit amet',
      avatar: {
        active: true,
        notifications: 5
      },
      time: new Date()
    },
    {
      id: 3,
      name: 'Joselito',
      message: 'Lorem ipsum dolor sit amet',
      avatar: {
        active: true,
        notifications: 5
      },
      time: new Date()
    }
  ] as IlistMessageItem[];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}
  clickItem({ id }: { id: typID }) {
    console.log('hello click', id);
  }
}
