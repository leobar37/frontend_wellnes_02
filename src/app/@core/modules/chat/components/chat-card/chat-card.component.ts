import { ChatuiService } from './../../services/chatui.service';
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
  ViewContainerRef,
  ElementRef
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { gsap } from 'gsap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: []
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
  // subject for destroy susscriptions

  private $destroy = new Subject<void>();

  currentScreen: Portal<any>;
  // templates
  @ViewChild('principal', { read: TemplateRef, static: true })
  principalTpl: TemplateRef<any>;
  @ViewChild('messagges', { read: TemplateRef, static: true })
  messagesTpl: TemplateRef<any>;

  // reference to card container chat
  @ViewChild('card') cardElement: ElementRef<HTMLDivElement>;
  // portals
  principalScreenTemplate: TemplatePortal<any>;
  messageScreenTemplate: TemplatePortal<{ id: typID }>;

  constructor(
    private viewRef: ViewContainerRef,
    private chatUiService: ChatuiService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    this.principalScreenTemplate = new TemplatePortal(
      this.principalTpl,
      this.viewRef
    );
    // this.currentScreen = this.principalScreenTemplate;
    this.currentScreen = this.getMessageTemplate({ id: 5 });
    this.animationsCard();
  }

  private animationsCard() {
    this.chatUiService
      .suscribeAnimationWithName('card:open')
      .pipe(takeUntil(this.$destroy))
      .subscribe((_) => {
        gsap.fromTo(
          this.cardElement.nativeElement,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1
          }
        );
      });
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
      this.currentScreen.detach();
    }
    this.currentScreen = this.getMessageTemplate(ctx);
  }
}
