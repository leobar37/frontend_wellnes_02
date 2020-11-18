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
  collapsableWidth = 0;
  widthSidebar = '256px';
  isCollapsed = false;
  mediaObserbable: Subscription;
  constructor(private media: MediaObserver) {
    // console.log(this.media.isActive('gt-xs'));
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
