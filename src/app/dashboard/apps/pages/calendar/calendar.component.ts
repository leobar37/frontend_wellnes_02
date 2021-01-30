import { Isesion } from '@core/models/eventmodels/sesion.model';
import { map } from 'rxjs/operators';
import { JwtService } from '@services/jwt.service';

import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { EventService } from '../../../events/services/event.service';
import { da } from 'date-fns/locale';
import _ from 'lodash';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  date = new Date();
  mode: NzCalendarMode = 'month';
  public sesions: Isesion[];
  constructor(
    private eventService: EventService,
    private jwtService: JwtService
  ) {}
  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
  ngOnInit(): void {
    this.listenQueries();
  }

  /*=============================================
  =            listen Routes            =
  =============================================*/
  listenQueries() {
    const user = this.jwtService.getUserOfToken();
    this.eventService
      .getEventsOfUser(user.id)
      .valueChanges.pipe(
        map((resp) => resp.data.getEventsOfUser),
        map((response) => {
          return _.flatMap(response.events.map((ev) => ev.sesions));
        })
      )
      .subscribe((sesions) => {
        this.sesions = sesions;
      });
  }

  public existSesion(date: Date) {
    const sesions = (this.sesions || []).filter((ev) => {
      const startSesion = new Date(ev.startSesion);
      console.log(startSesion.getDay());

      return (
        startSesion.getDate() === date.getDate() &&
        startSesion.getMonth() === date.getMonth() &&
        startSesion.getFullYear() === date.getFullYear()
      );
    });
    if (sesions.length > 0) {
      return sesions;
    }
    return null;
  }

  /*=============================================
  =            Dom Events            =
  =============================================*/

  changueItem($event): void {
    console.log($event);
  }
}
