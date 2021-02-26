import { SafeUrl } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  Inject,
  Input,
  OnChanges,
  ViewChild,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  Renderer2,
  HostBinding,
} from '@angular/core';
import { VgOverlayPlayComponent } from '@videogular/ngx-videogular/overlay-play';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { CONFIG_PLAYER, IOptionsVideoPlayer } from '../model';
import _ from 'lodash';
@Component({
  selector: 'app-videoplayer',
  template: `
    <vg-player (onPlayerReady)="ondPlayerReady($event)">
      <vg-controls [vgAutohide]="true">
        <vg-play-pause></vg-play-pause>
        <vg-fullscreen></vg-fullscreen>
        <vg-scrub-bar>
          <vg-scrub-bar-current-time
            [vgSlider]="true"
          ></vg-scrub-bar-current-time>
          <vg-scrub-bar-buffering-time></vg-scrub-bar-buffering-time>
        </vg-scrub-bar>
        <vg-volume></vg-volume>
        <vg-mute></vg-mute>
      </vg-controls>
      <!-- custom  overlay play -->
      <app-overlay-play #overlay class="overlay" [thumbnail]="thumbnail">
      </app-overlay-play>
      <video
        [vgMedia]="media"
        [src]="url"
        #media
        id="singleVideo"
        preload="auto"
      ></video>
    </vg-player>
  `,
  styleUrls: [`./stylesplayer.components.scss`],
})
export class VideoplayerComponent implements OnInit, AfterViewInit, OnChanges {
  url: string | SafeUrl;
  apiVideo: VgApiService;

  @ViewChild('media') elementvideo: ElementRef<HTMLVideoElement>;
  @Input()
  public set src(v: string | SafeUrl) {
    this.url = v;
  }
  // variables in css
  @HostBinding('style.--width') widthVideo: string;
  @HostBinding('style.--heigth') heigthVideo: string;

  @Input() thumbnail: string;
  @ViewChild('overlay') elment: VgOverlayPlayComponent;

  constructor(
    private render: Renderer2,
    @Inject(CONFIG_PLAYER) public options: IOptionsVideoPlayer
  ) {
    this.initOptions();
  }
  ngOnChanges(changes: SimpleChanges): void {}

  private initOptions() {
    this.widthVideo = this.getSizeVariable(this.options.width);
    this.heigthVideo = this.getSizeVariable(this.options.height);
  }

  private getSizeVariable(size: number | string): string {
    let returnSize: string;
    if (_.isNumber(size)) {
      returnSize = size + 'px';
    } else {
      returnSize = size;
    }
    return returnSize;
  }

  /**
   *
   * TODO:
   * - IMPLEMENTS ONREADY PLAYER FOR SHOW LOADING
   *
   */

  ngAfterViewInit(): void {}
  /*=============================================

Documentation : https://videogular.github.io/ngx-videogular/docs/getting-started/master-media.html

=============================================*/

  ngOnInit(): void {}
  ondPlayerReady(api: VgApiService) {
    console.log('player works');
    this.apiVideo = api;
    this.apiVideo.getDefaultMedia().subscriptions.canPlay.subscribe((el) => {});
  }
}
