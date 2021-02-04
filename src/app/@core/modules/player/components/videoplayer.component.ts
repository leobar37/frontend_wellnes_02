import { SafeUrl } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  Injector,
  Input,
  OnChanges,
  ViewChild,
  AfterViewInit,
  SimpleChanges,
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
      <video [vgMedia]="media" #media id="singleVideo" preload="auto">
        <source [src]="src" type="video/mp4" />
      </video>
    </vg-player>
  `,
  styleUrls: [`./stylesplayer.components.scss`],
})
export class VideoplayerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() src: string | SafeUrl;
  @Input() thumbnail: string;
  @ViewChild('overlay') elment: VgOverlayPlayComponent;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {}
  /*=============================================

Documentation : https://videogular.github.io/ngx-videogular/docs/getting-started/master-media.html

=============================================*/

  ngOnInit(): void {}
}
