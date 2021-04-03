import { tap } from 'rxjs/operators';

import { CommentService } from './../services/comment.service';
import { Comment } from '../models/comment.class';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { JwtService } from '@services/jwt.service';
import { IComment, ICommentDisplay } from '../model';

import { Subscription, Observable, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss', '../style.scss'],
  encapsulation: ViewEncapsulation.None
})
@UntilDestroy()
export class CommentsComponent implements OnInit, AfterViewInit {
  @Input() private idBootrapComment: number;
  @ViewChild('customTpl') customEmptyTpl: TemplateRef<any>;

  data: ICommentDisplay[] = [];

  comments$: Observable<Comment[]>;

  // private commentsRef: QueryRef<{ getComments: IComment[] }>;
  // private recolectorSubs: Subscription[] = [];

  constructor(
    // private configService: NzConfigService,
    private JwtService: JwtService,
    private commentsService: CommentService // private utilsService: UtilsService
  ) {}

  /*=============================================
  =            LIFECYCLE            =
  =============================================*/
  public ngAfterViewInit(): void {}

  public ngOnInit(): void {
    console.log('create commments component');

    // this.commentsRef = this.commentsService.getComments(this.idBootrapComment);
    // // listens
    // this.getcomments();

    this.commentsService.init(1);

    this.comments$ = this.commentsService.comments$.pipe(
      tap((_) => {
        console.log('get data');
      })
    );
    // // configure sub2
    // this.configureSubComments();
  }

  /*=============================================
=            LISTENS             =
=============================================*/
  // private configureSubComments() {
  //   this.commentsRef.subscribeToMore({
  //     document: SUB_NEWCOMMENTS,
  //     variables: {
  //       bootstrap: this.idBootrapComment
  //     },
  //     updateQuery: (
  //       prev,
  //       {
  //         subscriptionData: {
  //           data: {
  //             actionComment: { action, comment }
  //           }
  //         }
  //       }
  //     ) => {
  //       let comments = prev.getComments;
  //       /**
  //        * TODO:
  //        * [ ] Recepcionar los cambios
  //        */
  //       switch (action as CRUD_ACTION) {
  //         case 'CREATE':
  //           comments = [...comments, comment];
  //           break;
  //       }
  //       return {
  //         ...prev,
  //         getComments: comments
  //       };
  //     }
  //   });
  // }

  // public getcomments() {
  //   this.recolectorSubs.push(
  //     this.commentsRef.valueChanges
  //       .pipe(
  //         pluck('data', 'getComments'),
  //         map((comments) => {
  //           return comments
  //             .map(
  //               (item) =>
  //                 ({
  //                   ...item,
  //                   displayTime:
  //                     'Hace ' +
  //                     formatDistance(new Date(), new Date(item.createComment), {
  //                       locale: es
  //                     }),
  //                   author: item.user.name,
  //                   avatar: this.utilsService.resolveNormalPathImage(
  //                     item.user.image
  //                   )
  //                   // avatar: this.commentsService.getAvatarOfName(
  //                   //   item.user.name,
  //                   //   item.user.lastName
  //                   // ),
  //                 } as ICommentDisplay)
  //             )
  //             .reverse();
  //         })
  //       )
  //       .subscribe((resp) => (this.data = resp))
  //   );
  // }

  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public sendPrincipalComment(content: string): void {
    const resolvePromises = async () => {
      const user = this.JwtService.getUserOfToken();
      await this.commentsService
        .addComment({
          id_user: user.id,
          id_bootstrap: 1,
          comment: content
        } as IComment)
        .toPromise();
    };
    resolvePromises();
  }
}
