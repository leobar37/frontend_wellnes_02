import { Component, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange, BREAKPOINT } from '@angular/flex-layout';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  constructor(private media: MediaObserver) {}

  ngOnDestroy(): void {}
}
