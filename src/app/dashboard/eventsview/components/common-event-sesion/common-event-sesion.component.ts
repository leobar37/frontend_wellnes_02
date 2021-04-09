import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-common-event-sesion',
  template: ``,
  styles: []
})
export class CommonEventSesionComponent {
  constructor(public changueDetector: ChangeDetectorRef) {}

  visibleDrawerComments = false;
  visibleSesions = false;

  public openComments() {
    this.visibleDrawerComments = true;
  }
  public closeSesionDrawer = () => {
    this.visibleSesions = false;
    this.changueDetector.markForCheck();
  };
}
