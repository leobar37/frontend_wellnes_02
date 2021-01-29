import { Router } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import _ from 'lodash';
export interface IviewEvent extends IEvent {
  participants: number;
  countSesions: number;
  lessSesions: number;
  lastSesion: Date;
}

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class ListeventsComponent implements OnInit {
  private itemData: IviewEvent = {
    eventCover: 'assets/img/fitcamp.png',
    name: '9 días de sabiduria',
    participants: 45,
    countSesions: 55,
    lastSesion: new Date(56),
    lessSesions: 44,
  };

  public viewEventsData: IviewEvent[] = [];
  constructor(
    private eventsService: EventService,
    private utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((resp) => {
      //  this.viewEventsData =  ;
      this.viewEventsData = resp.data.getEvents.map((item) => {
        item = {
          ...item,
          eventCover: this.utils.resolvePathImage(
            item.eventCover as string
          ) as string,
        };
        return {
          ...this.itemData,
          ...item,
        };
      });
    });
  }

  /*=============================================
   =            event the dom            =
   =============================================*/
  redirectEdit(id: number) {
    this.router.navigate(['dashboard', 'events', 'event'], {
      queryParams: {
        edit: id,
      },
    });
  }
}
