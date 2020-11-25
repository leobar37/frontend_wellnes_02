import { IUser } from './../../../@core/models/User';
import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/*=============================================
       =            queries             =
=============================================*/
const UPLOADPICTURE = gql`
  mutation uploadImage($picture: Upload!) {
    addProfilePicture(picture: $picture)
  }
`;
const EDITPROFILE = gql`
  mutation editUser($id: ID!, $user: InputEditUser!) {
    editUser(id: $id, user: $user) {
      resp
      errors {
        message
      }
      user {
        name
        lastName
        password
        email
        password
      }
    }
  }
`;
@Injectable()
export class ProfileService {
  constructor(private apollo: Apollo) {}
  public uploadFile(file: File): Observable<FetchResult<any>> {
    return this.apollo
      .mutate({
        mutation: UPLOADPICTURE,
        variables: {
          picture: file,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(catchError((err) => throwError(err)));
  }

  public editUser(id: number, user: IUser) {
    return this.apollo.mutate({
      mutation: EDITPROFILE,
      variables: {
        user,
      },
    });
  }
}
