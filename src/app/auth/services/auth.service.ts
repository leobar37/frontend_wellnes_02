import { map } from 'rxjs/operators';
import { IoauthResponse } from '../../@core/models/reponses/authResponse';
import { IUser } from './../../@core/models/User';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { Observable } from 'rxjs';
const SING_IN = gql`
  mutation signIn($userSignIn: SignInInput!) {
    sigIn(user: $userSignIn) {
      resp
      token
      errors {
        code
        message
      }
    }
  }
`;
const SING_UP = gql`
  mutation signUp($user: InputUser!, $provider: Provider) {
    signUp(user: $user, provider: $provider) {
      resp
      errors {
        message
        code
      }
      token
    }
  }
`;

@Injectable()
export class AuthService {
  constructor(private apollo: Apollo) {}
  public sigIn(
    email: string,
    password: string,
    provider: string = 'email'
  ): Observable<IoauthResponse> {
    return this.apollo
      .mutate({
        mutation: SING_IN,
        variables: {
          userSignIn: { email, password, provider: provider.toUpperCase() },
        },
      })
      .pipe(map((data: any) => data.data.sigIn));
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  public signUp(user: IUser, provider = 'email'): Observable<IoauthResponse> {
    return this.apollo
      .mutate({
        mutation: SING_UP,
        variables: {
          user: user,
          provider: provider.toUpperCase(),
        },
      })
      .pipe(map((data: any) => data.data.signUp));
  }
}
