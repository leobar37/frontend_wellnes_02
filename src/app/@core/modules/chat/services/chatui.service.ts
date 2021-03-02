import {
  ApplicationRef,
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
// import { FloatComponent } from '../layouts/float/float.component';
@Injectable()
export class ChatuiService {
  private portal: DomPortalOutlet;
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private factory: ComponentFactoryResolver,

    @Inject(DOCUMENT) private document: Document
  ) {}
  get hostPortal() {
    if (this.portal) {
      return this.portal;
    } else {
      this.portal = new DomPortalOutlet(
        this.document.body,
        this.factory,
        this.appRef,
        this.injector
      );
      return this.portal;
    }
  }
  buildFloatComponent() {
    if (!this.hostPortal.hasAttached()) {
      import('../layouts/float/float.component').then(({ FloatComponent }) => {
        const component = new ComponentPortal(FloatComponent);
        this.hostPortal.attach(component);
      });
    }
  }
}
