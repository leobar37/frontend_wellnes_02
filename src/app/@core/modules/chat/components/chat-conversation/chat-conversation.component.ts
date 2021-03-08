import { interval, Subject } from 'rxjs';
import { IMessage } from './../../model';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  NgZone
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { take, switchMap, tap, share, takeUntil } from 'rxjs/operators';

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
export class ChatConversationComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('virtualScroll', { static: true })
  refScroll: CdkVirtualScrollViewport;

  scrollHandle$ = new Subject<void>();
  destroy$ = new Subject<void>();
  constructor(private zone: NgZone) {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  @Input() items: IMessage[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.items) {
      this.scrollHandle$.next();
    }
  }

  ngOnInit(): void {
    this.scrollHandle$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((_) =>
          interval(50).pipe(
            take(2),
            tap((_) => {
              this.zone.runOutsideAngular(() => {
                this.refScroll.scrollTo({
                  bottom: 0,
                  behavior: 'auto'
                });
              });
            })
          )
        ),
        share()
      )
      .subscribe();
    this.scrollHandle$.next();
  }
}
