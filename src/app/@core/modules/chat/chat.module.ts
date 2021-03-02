import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { FloatComponent } from './layouts/float/float.component';
import { ChatComponent } from './chat/chat.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChatuiService } from './services/chatui.service';
import { OverlayHoverModule } from '@core/ui/overlay-hover/overlay-hover.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ChatCardComponent } from './components/chat-card/chat-card.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';
import { ChatSearchComponent } from './components/chat-search/chat-search.component';
import { ChatListsAvatarComponent } from './components/chat-lists-avatar/chat-lists-avatar.component';
import { ChatAvatarComponent } from './components/chat-avatar/chat-avatar.component';
import { ChatListMessagesComponent } from './components/chat-list-messages/chat-list-messages.component';
import { ChatListMessageItemComponent } from './components/chat-list-message-item/chat-list-message-item.component';
import { AvatarSlideDirective } from './directives/avatar-slide.directive';
const material = [
  PortalModule,
  OverlayModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
];
const zorro = [NzButtonModule, NzIconModule, NzCardModule, NzImageModule];
const me = [OverlayHoverModule];
@NgModule({
  declarations: [FloatComponent, ChatComponent, ChatCardComponent, ChatHeaderComponent, ChatSearchComponent, ChatListsAvatarComponent, ChatAvatarComponent, ChatListMessagesComponent, ChatListMessageItemComponent, AvatarSlideDirective],
  imports: [CommonModule, SwiperModule, ...material, ...zorro, ...me],
  exports: [ChatComponent],
  providers: [ChatuiService],
})
export class ChatModule {}
