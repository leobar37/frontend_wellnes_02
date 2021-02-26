import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  defaultConfiguration,
  CONFIG_PLAYER,
  IOptionsVideoPlayer,
} from './model';
import _ from 'lodash';
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
export class PlayerModule {
  static forRoot(
    configPlayer?: IOptionsVideoPlayer
  ): ModuleWithProviders<PlayerModule> {
    let configuration = {} as IOptionsVideoPlayer;
    if (configPlayer) {
      configuration = _.merge(defaultConfiguration, configPlayer);
    } else {
      configuration = defaultConfiguration;
    }

    return {
      ngModule: PlayerModule,
      providers: [
        {
          provide: CONFIG_PLAYER,
          useValue: configuration,
        },
      ],
    };
  }
}
