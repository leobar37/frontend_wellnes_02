import { mergeMap, pluck, map, tap } from 'rxjs/operators';
import { from, of, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '@services/utils.service';
import { EventService } from './../../../events/services/event.service';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { AlertService } from '@core/modules/alert/alert.service';

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.scss'],
})
export class ListeventsComponent implements OnInit {
  public items: IEvent[] = [];
  public options: NgxMasonryOptions = {
    gutter: 20,
    horizontalOrder: true,
  };
  private recolectorSubs: Subscription[] = [];
  programs: IEvent[] = [];
  events: IEvent[] = [];

  // styles: CSSStyleDeclaration = {
  //   width: '100%',
  // };
  constructor(
    private eventService: EventService,
    private utilsService: UtilsService,
    private route: Router,
    private activateRouter: ActivatedRoute,
    private alertService: AlertService
  ) {}
  /*=============================================
 =            events DOM            =
 =============================================*/
  public redirectEvent(id: number) {
    this.route.navigateByUrl(`/dashboard/view/event/${id}`);
  }
  ngOnInit(): void {
    this.prepareLists();
  }

  /*=============================================
  =            METHODS            =
  =============================================*/

  private prepareLists() {
    const prepareEvent = (event: IEvent) => ({
      ...event,
      eventCover: this.utilsService.resolvePathImage(
        event.eventCover as string
      ) as string,
    });
    const fillLists = (event: IEvent) => {
      const isEvent = event.modeEvent == 'EVENT';
      if (isEvent) {
        this.events.push(event);
      } else {
        this.programs.push(event);
      }
    };
    const resetLists = (_) => {
      this.events = [];
      this.programs = [];
    };
    this.recolectorSubs.push(
      this.eventService
        .getEvents()
        .pipe(
          tap(resetLists),
          pluck('data', 'getEvents'),
          mergeMap((items) => from(items)),
          map(prepareEvent),
          tap(fillLists)
        )
        .subscribe({
          complete: () => {
            console.log(this.programs);
            console.log(this.events);
          },
        })
    );
  }
}
