import { UtilsService } from 'src/app/services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
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
  constructor(
    private activateRoute: ActivatedRoute,
    private eventService: EventService,
    private utils: UtilsService
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
            this.eventService.getEvent(params.id, true).subscribe(
              (el) =>
                (this.currentEvent = {
                  ...el.data.event,
                  eventCover: this.utils.resolvePathImage(
                    String(el.data.event.eventCover)
                  ),
                })
            );
          }
          return of(params);
        })
      )
      .subscribe();
  }
}
