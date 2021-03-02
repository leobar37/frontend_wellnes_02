import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[appIndex]',
})
export class IndexDirective implements OnInit {
  @Input('appIndex') reference: HTMLElement;
  constructor(private el: ElementRef) {
    // console.log(this.getHighestZIndex(document.body));
  }
  @HostBinding('style.zIndex') index;
  ngOnInit(): void {}

  getHighestZIndex(domNode: HTMLElement) {
    var highestZIndex = 0;
    var currentZIndex = 0;
    var nodes = domNode.getElementsByTagName('*');
    for (var i = 0; i < nodes.length; i++) {
      currentZIndex = Number(window.getComputedStyle(nodes[i]).zIndex);
      if (currentZIndex > highestZIndex) {
        highestZIndex = currentZIndex;
      }
    }

    return highestZIndex;
  }
}
