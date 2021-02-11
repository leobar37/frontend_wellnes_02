import { Isesion } from './../../../../@core/models/eventmodels/sesion.model';
import { IDetailResponse } from '@core/models/eventmodels/event.response';
import { UtilsService } from 'src/app/services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { JwtService } from '@services/jwt.service';
import { EventService as DisplayEventService } from '../../services/event.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryRef } from 'apollo-angular';
import { NgxMasonryOptions } from 'ngx-masonry';
@Component({
  selector: 'app-displayevent',
  templateUrl: './displayevent.component.html',
  styleUrls: ['../styles.scss'],
})
export class DisplayeventComponent implements OnInit, OnDestroy {
  currentEvent: IEvent;
  public isRegister: boolean = false;
  private refQuerieIsRegister: QueryRef<{ isRegisterEvent: IDetailResponse }>;
  private recolectSubs: Subscription[] = [];
  constructor(
    private activateRoute: ActivatedRoute,
    private eventService: EventService,
    private utils: UtilsService,
    private jwtService: JwtService,
    private serviceDisplayEvent: DisplayEventService,
    private modal: NzModalService,
    private router: Router
  ) {}

  /*=============================================
   =           Lfe Cicle            =
   =============================================*/

  ngOnInit(): void {
    this.listenRoutes();
  }
  ngOnDestroy(): void {
    this.recolectSubs.forEach((sub) => sub.unsubscribe());
  }

  /*=============================================
  =            gets             =
  =============================================*/
  get isVideo() {
    return this.currentEvent.video?.url;
  }

  /*=============================================
  =            listens            =
  =============================================*/
  private listenRoutes(): void {
    const subRouter = this.activateRoute.params
      .pipe(
        switchMap((params: Params) => {
          if ('id' in params) {
            // display event
            this.recolectSubs.push(
              // recolect sub
              this.eventService.getEvent(params.id, true).subscribe((el) => {
                this.currentEvent = {
                  ...el.data.event,
                  eventCover: this.utils.resolvePathImage(
                    String(el.data.event.eventCover)
                  ),
                };

                this.updateifRegiterInEvent();
                // enf id register
              })
            );
          }
          return of(params);
        })
      )
      .subscribe();
    this.recolectSubs.push(subRouter);
  }

  /*=============================================
=            functions bd            =
=============================================*/

  private updateifRegiterInEvent() {
    const user = this.jwtService.getUserOfToken();
    this.refQuerieIsRegister = this.serviceDisplayEvent.isRegisterinEvent(
      user.id,
      Number(this.currentEvent.id)
    );
    this.refQuerieIsRegister.valueChanges.subscribe((resp) => {
      this.isRegister = resp.data.isRegisterEvent.resp;
    });
  }
  /*=============================================
  =            DOM EVENTs            =
  =============================================*/
  registerEvent() {
    const user = this.jwtService.getUserOfToken();
    this.serviceDisplayEvent
      .registerEvent(user.id, Number(this.currentEvent.id))
      .subscribe(({ data }) => {
        const resp = data.attendEvent.resp;
        if (resp) {
          // update register
          this.refQuerieIsRegister.refetch();
          this.modal.success({
            nzTitle: 'Correcto',
            nzContent: 'Se ha registrado a este evento',
          });
        }
      });
  }
  // navigate sesion sesion
  navigateSesion(sesion: Isesion) {
    //  this.r
    this.router.navigate([
      '/dashboard',
      'view',
      'event',
      this.currentEvent.id,
      sesion.id,
    ]);
  }
}
