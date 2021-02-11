import { SafeUrl } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  Injector,
  Input,
  ViewChildren,
  OnChanges,
  ViewChild,
  AfterViewInit,
  SimpleChanges,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { VgOverlayPlayComponent } from '@videogular/ngx-videogular/overlay-play';

@Component({
  selector: 'app-videoplayer',
  template: `
    <vg-player>
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

  @ViewChild('media') elementvideo: ElementRef<HTMLVideoElement>;
  @Input()
  public set src(v: string | SafeUrl) {
    this.url = v;
  }

  @Input() thumbnail: string;
  @ViewChild('overlay') elment: VgOverlayPlayComponent;

  constructor(private render: Renderer2) {}
  ngOnChanges(changes: SimpleChanges): void {}

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
}
