import { Component, OnInit, Injector, Input } from '@angular/core';
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
      <vg-overlay-play>
        <h1>play</h1>
      </vg-overlay-play>
      <video [vgMedia]="media" #media id="singleVideo" preload="auto">
        <source [src]="src" type="video/mp4" />
      </video>
    </vg-player>
  `,
  styleUrls: [`./stylesplayer.components.scss`],
})
export class VideoplayerComponent implements OnInit {
  @Input() src: string;
  constructor() {}

  /*=============================================

Documentation : https://videogular.github.io/ngx-videogular/docs/getting-started/master-media.html

=============================================*/

  ngOnInit(): void {}
}
