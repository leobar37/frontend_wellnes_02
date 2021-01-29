import { IDetailResponse } from '@core/models/eventmodels/event.response';
import { UtilsService } from 'src/app/services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { JwtService } from '@services/jwt.service';
import { EventService as DisplayEventService } from '../../services/event.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryRef } from 'apollo-angular';
@Component({
  selector: 'app-displayevent',
  templateUrl: './displayevent.component.html',
  styleUrls: ['./displayevent.component.scss'],
})
export class DisplayeventComponent implements OnInit {
  currentEvent: IEvent = {
    name: 'Emprende con nosotros',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis quia illum modi reiciendis libero iure at quae repudiandae enim ex.',
    eventCover: 'assets/img/profileexample.jpg',
    startEvent: new Date(10),
  };
  public isRegister: boolean = false;
  private refQuerieIsRegister: QueryRef<{ isRegisterEvent: IDetailResponse }>;
  constructor(
    private activateRoute: ActivatedRoute,
    private eventService: EventService,
    private utils: UtilsService,
    private jwtService: JwtService,
    private serviceDisplayEvent: DisplayEventService,
    private modal: NzModalService
  ) {}

  /*=============================================
   =            lifeClycle            =
   =============================================*/

  ngOnInit(): void {
    this.listenRoutes();
  }
  /*=============================================
  =            listens            =
  =============================================*/
  private listenRoutes(): void {
    this.activateRoute.params
      .pipe(
        switchMap((params: Params) => {
          if ('id' in params) {
            // display event
            this.eventService.getEvent(params.id, true).subscribe((el) => {
              this.currentEvent = {
                ...el.data.event,
                eventCover: this.utils.resolvePathImage(
                  String(el.data.event.eventCover)
                ),
              };

              // if register
              this.updateifRegiterInEvent();

              // enf id register
            });
          }
          return of(params);
        })
      )
      .subscribe();
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
}
