import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { generateRandomColor } from '@helpers/MediumHelpers';
import { tap } from 'rxjs/operators';
import { gql, Apollo } from 'apollo-angular';
import { IComment } from '../model';
const FRAGMENTCOMMENT = gql`
  fragment fragmentComment on Comment {
    id
    user {
      id
      image
      lastName
      getCompleteName
    }
    comment
    likes
    id_bootstrap
    createComment
    updateComment
  }
`;

export const SUB_NEWCOMMENTS = gql`
  ${FRAGMENTCOMMENT}
  subscription actionComment($bootstrap: Int!) {
    actionComment(bootstrap: $bootstrap) {
      action
      comment {
        ...fragmentComment
      }
    }
  }
`;

const GET_COMMENTS = gql`
  ${FRAGMENTCOMMENT}
  query getComments($bootstrap: Int) {
    getComments(bootstrap: $bootstrap) {
      ...fragmentComment
    }
  }
`;
const ADD_COMMENT = gql`
  ${FRAGMENTCOMMENT}
  mutation addComment($inputComment: InputComment!) {
    addComment(comment: $inputComment) {
      ...fragmentComment
    }
  }
`;
@Injectable()
export class CommentService {
  constructor(private http: HttpClient, private apollo: Apollo) {}
  addComment(comment: IComment) {
    return this.apollo
      .mutate<{ addComment: Comment }>({
        mutation: ADD_COMMENT,
        variables: {
          inputComment: { ...comment },
        },
      })
      .pipe(
        tap((el) => {
          console.log('comment added');
          console.log(el);
        })
      );
  }
  getComments(bootstrap?: number) {
    let variables: { [key: string]: any } = {};
    if (bootstrap) {
      variables.bootstrap = bootstrap;
    }
    return this.apollo.watchQuery<{ getComments: IComment[] }>({
      query: GET_COMMENTS,
      variables,
    });
  }

  getAvatarOfName(name: string, lastName: string) {
    return `https://ui-avatars.com/api/?background=${generateRandomColor()}&color=fff&name=${name}+${lastName}`;
  }
}
