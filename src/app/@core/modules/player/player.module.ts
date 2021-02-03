import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 *
 *  dependecien player video
 *   documentation  : https://videogular.github.io/ngx-videogular/docs/modules/core/
 *
 */

import { VideoplayerComponent } from './components/videoplayer.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';

@NgModule({
  declarations: [VideoplayerComponent],
  imports: [CommonModule, VgControlsModule, VgCoreModule, VgOverlayPlayModule],
  exports: [VideoplayerComponent],
})
export class PlayerModule {}
