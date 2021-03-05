import { FormControl, Validators } from '@angular/forms';
import { ChatuiService } from './../../services/chatui.service';
import { Portal, TemplatePortal } from '@angular/cdk/portal';
import { typID } from '@core/models/types';
import {
  IlistMessageItem,
  IRecentMessages,
  IUserChat,
  IMessage
} from './../../model';
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
import { takeUntil, map } from 'rxjs/operators';
import { Subject, of, Observable } from 'rxjs';
import { ChatDataService } from '../../services/chat-data.service';
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

  // message
  messageControl: FormControl = new FormControl('', [Validators.required]);

  recentsMessages: Observable<IRecentMessages[]> = of([]);
  activeUsers: Observable<IUserChat[]> = of([]);
  messages$: Observable<IMessage[]> = of([]);
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

  // variables in view
  nameRemitent: Observable<string> = of('');

  // variables manipule state
  constructor(
    private viewRef: ViewContainerRef,
    private chatUiService: ChatuiService,
    private dataService: ChatDataService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    this.principalScreenTemplate = new TemplatePortal(
      this.principalTpl,
      this.viewRef
    );
    this.currentScreen = this.principalScreenTemplate;
    this.animationsCard();
    this.setupObservable();
    this.listenChanguesForm();
  }
  private listenChanguesForm() {
    this.messageControl.valueChanges.subscribe(async (value) => {
      //  addd message
      await this.dataService
        .createMessage({
          id_conversation: this.currentConversation,
          message: value
        })
        .toPromise();
    });
  }

  private setupObservable(): void {
    this.dataService.init();
    // fill observables
    this.recentsMessages = this.dataService.recentMessages$;
    this.activeUsers = this.dataService.activeUsers$;
    this.messages$ = this.dataService.messages$;

    // this.nameRemitent =  this.dataService.messages$.pipe(map( els => els.find(el => !el.reverse).name))
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

  get currentConversation() {
    const id = localStorage.getItem('conver');
    if (id) {
      return Number(id);
    }
    return undefined;
  }
  set currentConversation(id: number) {
    localStorage.setItem('conver', String(id));
  }

  // reverse  principal
  backPrincipal() {
    if (this.principalScreenTemplate) {
      localStorage.removeItem('conver');
      // destroy
      this.dataService.destroyOnNewMessage();
      this.currentScreen = this.principalScreenTemplate;
    }
  }
  // click in avatar
  enterChat(id: number) {
    const sub = this.dataService
      .createConversation(Number(id))
      .subscribe((conver) => {
        this.currentScreen = this.getMessageTemplate({ id: conver.id });
        sub.unsubscribe();
      });
  }

  // build messages in template
  getMessageTemplate(ctx: { id: typID }) {
    this.dataService.suscribeOnNewMessage({ idConversation: Number(ctx.id) });
    this.currentConversation = Number(ctx.id);
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
    // set currrent conversation id

    this.dataService.getConversation(Number(ctx.id)).subscribe((conver) => {
      this.currentScreen = this.getMessageTemplate({ id: conver.id });
    });
  }
}
