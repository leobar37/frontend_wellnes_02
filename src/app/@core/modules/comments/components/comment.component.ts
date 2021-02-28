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
    </nz-comment>
  `,
  styles: [],
})
export class CommentComponent implements OnInit {
  @Input() comment: ICommentDisplay;
  constructor() {}
  ngOnInit(): void {}
}
