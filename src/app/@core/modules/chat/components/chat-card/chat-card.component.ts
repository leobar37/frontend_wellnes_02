import { Portal, TemplatePortal } from '@angular/cdk/portal';
import { typID } from '@core/models/types';
import { IlistMessageItem } from './../../model';
import {
  Component,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatCardComponent implements OnInit, OnChanges {
  config: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 10,
    mousewheel: true
  };
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

  currentScreen: Portal<any>;
  // templates
  @ViewChild('principal', { read: TemplateRef, static: true })
  principalTpl: TemplateRef<any>;
  @ViewChild('messagges', { read: TemplateRef, static: true })
  messagesTpl: TemplateRef<any>;

  // portals
  principalScreenTemplate: TemplatePortal<any>;
  messageScreenTemplate: TemplatePortal<{ id: typID }>;

  constructor(private viewRef: ViewContainerRef) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    this.principalScreenTemplate = new TemplatePortal(
      this.principalTpl,
      this.viewRef
    );
    // this.currentScreen = this.principalScreenTemplate;
    this.currentScreen = this.getMessageTemplate({ id: 5 });
  }

  // reverse  principal
  backPrincipal() {
    if (this.principalScreenTemplate) {
      this.currentScreen = this.principalScreenTemplate;
    }
  }

  // build messages in template
  getMessageTemplate(ctx: { id: typID }) {
    if (this.messageScreenTemplate) {
      this.messageScreenTemplate.context = ctx;
      return this.messageScreenTemplate;
    } else {
      this.messageScreenTemplate = new TemplatePortal(
        this.messagesTpl,
        this.viewRef,
        ctx
      );
      return this.messageScreenTemplate;
    }
  }

  clickItem(ctx: { id: typID }) {
    if (this.currentScreen.isAttached) {
      console.log('attached');

      this.currentScreen.detach();
    }
    this.currentScreen = this.getMessageTemplate(ctx);
  }
}
