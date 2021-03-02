import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { IndexDirective } from './index.directive';
@NgModule({
  declarations: [OverlayComponent, IndexDirective],
  imports: [CommonModule, OverlayModule],
  exports: [OverlayComponent],
})
export class OverlayHoverModule {}
