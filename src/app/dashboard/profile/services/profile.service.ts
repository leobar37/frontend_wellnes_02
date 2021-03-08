import { FileResponse } from '../../../@core/models/reponses/response';
import { JwtService } from './../../../services/jwt.service';
import { IUser } from './../../../@core/models/User';
import { Injectable, Injector } from '@angular/core';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, pluck } from 'rxjs/operators';
import { UserResponse } from 'src/app/@core/models/reponses/profile.response';
import { EVENTFRAGMENT } from '@fragments/event.fragment';
import { CREDIT_FRAGMENT } from '@fragments/credit';
/*=============================================
       =            queries             =
=============================================*/
const USERFRAGMENT = gql`
  ${CREDIT_FRAGMENT}
  fragment userprofile on User {
    name
    lastName
    code
    id
    email
    image
    description
    create
    phone
    comfirmed
    credit {
      ...credit
    }
  }
`;

const GET_USER_EVENTCREATED = gql`
  ${USERFRAGMENT}
  ${EVENTFRAGMENT}
  query getUser($id: ID!, $mode: String!) {
    getUser(id: $id) {
      resp
      user {
        ...userprofile
        birth
        eventsCreated(mode: $mode) {
          ...eventFragment
        }
      }
      errors {
        message
      }
    }
  }
`;
const GET_USER_WITH_REFERREALS = gql`
  ${USERFRAGMENT}
  query getUser($id: ID!) {
    getUser(id: $id) {
      resp
      user {
        ...userprofile
        birth

        referreals {
          ...userprofile
          birth
        }
      }
      errors {
        message
      }
    }
  }
`;
const GET_USER = gql`
  ${USERFRAGMENT}
  query getUser($id: ID!) {
    getUser(id: $id) {
      resp
      user {
        ...userprofile
        birth
      }
      errors {
        message
      }
    }
  }
`;

/*=============================================
=            mutate            =
=============================================*/
const UPLOADPICTURE = gql`
  mutation uploadImage($picture: Upload!, $id: Int!) {
    addProfilePicture(id: $id, picture: $picture) {
      resp
      errors {
        code
        message
      }
      path
    }
  }
`;
const EDITPROFILE = gql`
  ${USERFRAGMENT}
  mutation editUser($id: ID!, $user: InputEditUser!) {
    editUser(id: $id, user: $user) {
      resp
      errors {
        code
        message
      }
      user {
        ...userprofile
        birth
      }
    }
  }
`;
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  jwtService: JwtService;
  private user: IUser;
  constructor(private apollo: Apollo, private injector: Injector) {}
  public uploadFile(
    file: File,
    id: number
  ): Observable<FetchResult<{ addProfilePicture: FileResponse }>> {
    return this.apollo
      .mutate<{ addProfilePicture: FileResponse }>({
        mutation: UPLOADPICTURE,
        variables: {
          picture: file,
          id: Number(id)
        },
        context: {
          useMultipart: true
        }
      })
      .pipe(catchError((err) => throwError(err)));
  }

  public async onlyUser() {
    if (this.user) {
      this.user;
    } else {
      this.user = await this.getUser(null, 'only')
        .pipe(pluck('data', 'getUser', 'user'))
        .toPromise();
    }
    return this.user;
  }
  public getUser(
    mode?: string,
    relation?: 'eventscreated' | 'referreals' | 'eventasisted' | 'only'
  ): Observable<ApolloQueryResult<{ getUser: UserResponse }>> {
    this.jwtService = this.injector.get<JwtService>(JwtService);
    const user = this.jwtService.getUserOfToken();
    let query = GET_USER;
    if (relation)
      switch (relation) {
        case 'referreals': {
          query = GET_USER_WITH_REFERREALS;
          break;
        }
        case 'eventscreated': {
          query = GET_USER_EVENTCREATED;
          break;
        }
        case 'only': {
          query = GET_USER;
          break;
        }
      }

    return this.apollo
      .query<{ getUser: UserResponse }>({
        query: query,
        variables: {
          id: user.id,
          mode: mode || 'EVENT'
        }
      })
      .pipe(tap((res) => (this.user = res.data.getUser.user)));
  }

  public editUser(
    id: number,
    user: IUser,
    mode?: string
  ): Observable<FetchResult<{ editUser: UserResponse }>> {
    let time = null;
    try {
      time = user.birth.getTime();
    } catch (error) {
      time = this.user.birth;
    }
    return this.apollo
      .mutate<{ editUser: UserResponse }>({
        mutation: EDITPROFILE,
        variables: {
          user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            phone: user.phone,
            birth: time,
            description: user.description || null
          },
          id
        }
      })
      .pipe(tap(console.log));
  }
}
