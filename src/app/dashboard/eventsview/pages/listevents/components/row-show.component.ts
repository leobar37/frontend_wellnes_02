import { IEvent } from '@core/models/eventmodels/event.model';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {
  EventsOperationService,
  eventsCategoryOperations,
} from '../../../services/events.operation';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-row-show',
  template: `
    <ng-container *ngIf="(events | async)?.length > 0">
      <div>
        <h2 class="title line_addon">
          {{ label }}
        </h2>
        <ng-container *ngIf="showButton">
          <button
            *ngIf="args.idCategory !== -1"
            nz-button
            nzType="primary"
            [routerLink]="[]"
            [queryParams]="{ category: args.idCategory }"
            nzGhost
          >
            ver categoria
          </button>
        </ng-container>
      </div>

      <swiper
        *ngIf="!loading; else loadingTpl"
        [config]="configSwiper"
        class="row_galery"
      >
        <app-card *ngFor="let item of events | async" [item]="item"></app-card>
      </swiper>
      <ng-template #loadingTpl>
        <nz-spin [nzSpinning]="loading" ] nzSize="large"> </nz-spin>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['../listevents.component.scss'],
  providers: [EventsOperationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowShowComponent implements OnInit {
  @Input() label: string;
  @Input() items: IEvent[] = [];
  @Input() args: eventsCategoryOperations;
  @Input() showButton;
  loading = false;
  events: Observable<IEvent[]>;
  configSwiper: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 10,
    direction: 'horizontal',
    autoplay: true,
    speed: 300,
  };
  constructor(private eventsOperationService: EventsOperationService) {}
  ngOnInit(): void {
    if (typeof this.showButton == 'undefined') {
      this.showButton = true;
    }
    this.args.idCategory;
    this.events = this.eventsOperationService.getEventOfCategory(this.args);
  }
}
