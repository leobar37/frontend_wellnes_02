import { Component, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange, BREAKPOINT } from '@angular/flex-layout';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  constructor(private activatedRoute: ActivatedRoute) {}

  // actions

  ngOnDestroy(): void {}
}
