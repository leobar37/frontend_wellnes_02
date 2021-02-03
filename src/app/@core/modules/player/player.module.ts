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
import { ThumbnailPlayModule } from './plugins/thumbnail-play/thumbnail-play.module';

@NgModule({
  declarations: [VideoplayerComponent],
  imports: [CommonModule, VgControlsModule, VgCoreModule, ThumbnailPlayModule],
  exports: [VideoplayerComponent],
})
export class PlayerModule {}
