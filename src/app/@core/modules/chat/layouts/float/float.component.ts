import { Portal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChatCardComponent } from '../../components/chat-card/chat-card.component';
@Component({
  selector: 'app-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss'],
})
export class FloatComponent implements OnInit {
  open = false;
  portal: Portal<any>;
  constructor() {}
  @ViewChild('vc', { read: ViewContainerRef, static: false })
  vc: ViewContainerRef;
  openEvent() {
    if (!this.portal) {
      this.portal = new ComponentPortal(ChatCardComponent);
    }
  }
  ngOnInit(): void {
    if (!this.portal) {
      this.portal = new ComponentPortal(ChatCardComponent);
    }
    this.open = true;
  }
}
