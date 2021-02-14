import { ICommentDisplay } from './../model';
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-comment',
  template: `
    <!-- comment -->
    <nz-comment [nzAuthor]="comment.author" [nzDatetime]="comment.displayTime">
      <nz-avatar nz-comment-avatar nzIcon="user" [nzSrc]="comment.avatar">
      </nz-avatar>
      <nz-comment-content>
        <p>{{ comment.comment }}</p>
      </nz-comment-content>
      <!-- <nz-comment-action>
        <i
          nz-tooltip
          nzTitle="Like"
          nz-icon
          nzType="like"
          [nzTheme]="comment.likes > 0 ? 'twotone' : 'outline'"
          (click)="like()"
        ></i>
        <span class="count like">{{ comment.likes }}</span>
      </nz-comment-action> -->
    </nz-comment>
  `,
  styles: [],
})
export class CommentComponent implements OnInit {
  @Input() comment: ICommentDisplay;
  constructor() {}
  ngOnInit(): void {}
}
