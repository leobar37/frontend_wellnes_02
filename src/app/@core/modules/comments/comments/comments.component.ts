import { UtilsService } from 'src/app/services/utils.service';
import { CRUD_ACTION } from './../model';
import { QueryRef } from 'apollo-angular';
import { CommentService, SUB_NEWCOMMENTS } from './../services/comment.service';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { JwtService } from '@services/jwt.service';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { formatDistance } from 'date-fns';
import { IComment, ICommentDisplay } from '../model';
import es from 'date-fns/locale/es';
import { pluck, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, AfterViewInit, OnDestroy {
  user = {
    name: 'Elmer Joselito',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  };

  @Input() private idBootrapComment: number;
  @ViewChild('customTpl') customEmptyTpl: TemplateRef<any>;
  data: ICommentDisplay[] = [];
  private commentsRef: QueryRef<{ getComments: IComment[] }>;
  private recolectorSubs: Subscription[] = [];

  constructor(
    private configService: NzConfigService,
    private jwtService: JwtService,
    private commentsService: CommentService,
    private utilsService: UtilsService
  ) {}

  /*=============================================
  =            LIFECYCLE            =
  =============================================*/
  public ngAfterViewInit(): void {
    this.configService.set('empty', {
      nzDefaultEmptyContent: this.customEmptyTpl,
    });
  }

  public ngOnInit(): void {
    this.commentsRef = this.commentsService.getComments(this.idBootrapComment);
    // listens
    this.getcomments();
    // configure sub
    this.configureSubComments();
  }

  ngOnDestroy(): void {
    this.recolectorSubs.forEach((sub) => sub.unsubscribe());
  }

  /*=============================================
=            LISTENS             =
=============================================*/
  private configureSubComments() {
    this.commentsRef.subscribeToMore({
      document: SUB_NEWCOMMENTS,
      variables: {
        bootstrap: this.idBootrapComment,
      },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: {
              actionComment: { action, comment },
            },
          },
        }
      ) => {
        let comments = prev.getComments;
        /**
         * TODO:
         * [ ] Recepcionar los cambios
         */
        switch (action as CRUD_ACTION) {
          case 'CREATE':
            comments = [...comments, comment];
            break;
        }
        return {
          ...prev,
          getComments: comments,
        };
      },
    });
  }

  public getcomments() {
    this.recolectorSubs.push(
      this.commentsRef.valueChanges
        .pipe(
          pluck('data', 'getComments'),
          map((comments) => {
            return comments
              .map(
                (item) =>
                  ({
                    ...item,
                    displayTime:
                      'Hace ' +
                      formatDistance(new Date(), new Date(item.createComment), {
                        locale: es,
                      }),
                    author: item.user.getCompleteName,
                    avatar: this.utilsService.resolveNormalPathImage(
                      item.user.image
                    ),
                    // avatar: this.commentsService.getAvatarOfName(
                    //   item.user.name,
                    //   item.user.lastName
                    // ),
                  } as ICommentDisplay)
              )
              .reverse();
          })
        )
        .subscribe((resp) => (this.data = resp))
    );
  }

  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public sendPrincipalComment(content: string): void {
    const resolvePromises = async () => {
      const user = this.jwtService.getUserOfToken();
      await this.commentsService
        .addComment({
          id_user: user.id,
          id_bootstrap: this.idBootrapComment,
          comment: content,
        } as IComment)
        .toPromise();
    };
    resolvePromises();
  }
}
