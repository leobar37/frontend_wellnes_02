import {
  Directive,
  ViewContainerRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
@Directive({
  selector: '[appAvatarSlide]',
})
export class AvatarSlideDirective {
  constructor(
    private ref: ViewContainerRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    console.log('this el');
    console.log(this.el);
    const parent = this.renderer.createElement('div') as HTMLDivElement;
  }
}
