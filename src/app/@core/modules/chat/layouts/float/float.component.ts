import { ChatuiService } from './../../services/chatui.service';
import { Portal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss'],
  animations: []
})
@UntilDestroy()
export class FloatComponent implements OnInit {
  open = false;
  portal: Portal<any>;
  constructor(private uiChatService: ChatuiService) {}
  @ViewChild('vc', { read: ViewContainerRef, static: false })
  vc: ViewContainerRef;
  public openEvent() {
    this.open = true;
    this.uiChatService.actionAnimation('card:open');
  }
  public closeEvent() {
    this.uiChatService.actionAnimation('card:close');
  }
  openPortal() {
    if (!this.portal) {
      import('../../components/chat-card/chat-card.component').then(
        ({ ChatCardComponent }) => {
          this.portal = new ComponentPortal(ChatCardComponent);
        }
      );
    }
  }
  ngOnInit(): void {
    // build portal
    this.openPortal();
    this.uiChatService.observeOpenChat$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.open = true;
      });

    this.uiChatService.observeCloseChat$
      .pipe(untilDestroyed(this))
      .subscribe((_) => {
        this.open = false;
      });
  }
}
