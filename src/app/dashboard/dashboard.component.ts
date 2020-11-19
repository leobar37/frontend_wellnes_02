import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  collapsableWidth = 0;
  widthSidebar = '256px';
  isCollapsed = false;
  mediaObserbable: Subscription;
  constructor(private media: MediaObserver) {}

  ngOnInit(): void {
    this.mediaObserbable = this.media
      .asObservable()
      .subscribe((data: MediaChange[]) => {
        const existMd = data.some(
          ({ mqAlias }) => mqAlias.toLocaleLowerCase() === 'gt-xs'
        );
        if (existMd) {
          this.collapsableWidth = 80;
          this.widthSidebar = '256px';
        } else {
          this.collapsableWidth = 0;
          this.widthSidebar = '180px';
        }
      });
  }

  ngOnDestroy(): void {
    this.mediaObserbable.unsubscribe();
  }
}
