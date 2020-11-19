import { IUser } from './../../@core/models/User';
import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
const SING_IN = gql`
  mutation signIn($data: SignInInput!) {
    sigIn(user: $data)
  }
`;

const SING_UP = gql`
  mutation signUp($user: InputUser!) {
    signUp(user: $user)
  }
`;
@Injectable()
export class AuthService {
  constructor(private apollo: Apollo) {}
  public sigIn(
    email: string,
    password: string
  ): Observable<FetchResult<string>> {
    return this.apollo.mutate({
      mutation: SING_IN,
      variables: { data: { email, password } },
    });
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  public signUp(user: IUser): Observable<FetchResult<string>> {
    console.log(user);

    return this.apollo.mutate({
      mutation: SING_UP,
      variables: {
        user: user,
      },
    });
  }
}
