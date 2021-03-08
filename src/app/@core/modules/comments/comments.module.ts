import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzCardModule } from 'ng-zorro-antd/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CommentService } from './services/comment.service';
import { CommentComponent } from './components/comment.component';
import { BoxwriteCommentComponent } from './components/boxwrite-comment.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
const zorro = [
  NzIconModule,
  NzInputModule,
  NzFormModule,
  NzCommentModule,
  NzLayoutModule,
  NzListModule,
  NzButtonModule,
  NzAvatarModule,
  NzCardModule
];
const material = [MatInputModule, MatButtonModule];

const nativeModules = [FormsModule, HttpClientModule, PickerModule];
@NgModule({
  declarations: [CommentsComponent, CommentComponent, BoxwriteCommentComponent],
  imports: [CommonModule, ...zorro, ...nativeModules, ...material],
  exports: [CommentsComponent],
  providers: [CommentService]
})
export class CommentsModule {}
