import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from './../../../../services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.scss'],
})
export class ListeventsComponent implements OnInit {
  public items: IEvent[] = [];
  constructor(
    private eventService: EventService,
    private utilsService: UtilsService,
    private route: Router,
    private activateRouter: ActivatedRoute
  ) {}

  /*=============================================
 =            events DOM            =
 =============================================*/

  public redirectEvent(id: number) {
    this.route.navigateByUrl(`/dashboard/view/event/${id}`);
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((resp) => {
      if (resp.data) {
        this.items = resp.data.getEvents.map((ev) => ({
          ...ev,
          eventCover: this.utilsService.resolvePathImage(
            ev.eventCover as string
          ) as string,
        }));
      }
    });
  }
}
