import { ProfileService } from './../../../profile/services/profile.service';
import { IUser } from '@core/models/User';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { IDetailResponse } from '@core/models/eventmodels/event.response';
import { UtilsService } from 'src/app/services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit, OnDestroy, Type } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { JwtService } from '@services/jwt.service';
import { EventService as DisplayEventService } from '../../services/event.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QueryRef } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import {
  IModalData,
  ModalConfirmInscriptionComponent
} from '../../components/modal-confirm-inscription/modal-confirm-inscription.component';
@Component({
  selector: 'app-displayevent',
  templateUrl: './displayevent.component.html',
  styleUrls: ['../styles.scss'],
  providers: []
})
export class DisplayeventComponent implements OnInit, OnDestroy {
  currentEvent: IEvent;
  public isRegister: boolean = false;
  private modalConfirmRegister: Type<ModalConfirmInscriptionComponent>;
  private refQuerieIsRegister: QueryRef<{ isRegisterEvent: IDetailResponse }>;
  private recolectSubs: Subscription[] = [];
  sizeDisplay = '500px';
  constructor(
    private activateRoute: ActivatedRoute,
    private eventService: EventService,
    private utils: UtilsService,
    private jwtService: JwtService,
    private serviceDisplayEvent: DisplayEventService,
    private modal: NzModalService,
    private router: Router,
    private dialog: MatDialog,
    private userService: ProfileService
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
  ============================================= */
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
                  eventCover: String(el.data.event.eventCover)
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
  =            GETS LOCAL            =
  =============================================*/

  private componentConfirmCredits(callback: () => void) {
    if (this.modalConfirmRegister) {
      callback();
    } else {
      const components = import(
        '../../components/modal-confirm-inscription/modal-confirm-inscription.component'
      ).then((component) => {
        this.modalConfirmRegister = component.ModalConfirmInscriptionComponent;
        callback();
      });
    }
  }

  private requestRegisterEvent(user: IUser) {
    this.serviceDisplayEvent
      .registerEvent(Number(user.id), Number(this.currentEvent.id))
      .subscribe(({ data }) => {
        const resp = data.attendEvent.resp;
        if (resp) {
          // update register
          this.refQuerieIsRegister.refetch();
          this.modal.success({
            nzTitle: 'Correcto',
            nzContent: 'Se ha registrado a este evento'
          });
        }
      });
  }

  /*=============================================
  =            DOM EVENTs            =
  =============================================*/
  public async registerEvent() {
    const user = await this.userService.onlyUser();
    console.log(user);
    const haveCredits = user.credit.currentCredits >= this.currentEvent.credits;
    if (!haveCredits) {
      this.modal.error({
        nzTitle: 'Creditos insuficientes',
        nzContent: 'No dispone de los creditos necesarios para este programa',
        nzOkText: 'Solicitar',
        nzCancelText: 'cancelar'
      });
      return;
    }
    this.componentConfirmCredits(() => {
      const type =
        this.currentEvent.modeEvent == 'EVENT' ? 'Evento' : 'Programa';
      const text = ``;
      const ref = this.dialog.open(this.modalConfirmRegister, {
        data: {
          nameEvent: this.currentEvent.name,
          prefix: type,
          costCredits: this.currentEvent.credits,
          type: this.currentEvent.modeEvent,
          text: text,
          userCredits: user.credit?.currentCredits
        } as IModalData
      });
      ref.afterClosed().subscribe((resp) => {
        // register in event
        if (resp) {
          this.requestRegisterEvent(user);
        }
      });
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
      sesion.id
    ]);
  }
}
