import { FetchResult, ApolloQueryResult } from '@apollo/client/core';
import { FileResponse } from '@core/models/reponses/response';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { Injectable } from '@angular/core';
import { ISesionResponse } from '@core/models/reponses/sesion.response';
import { Observable } from 'rxjs';
import { gql, Apollo } from 'apollo-angular';
import { getTimestamp } from '@helpers/helpers';

const FRAGMENTSESION = gql`
  fragment sesionFragment on Sesion {
    id
    sesionCover
    startSesion
    nameSesion
    description
    duration
    createdSesion
    linkRoom
  }
`;

const GETSESIONS = gql`
  ${FRAGMENTSESION}
  query getSesions($idEvent: ID!) {
    sesions(idEvent: $idEvent) {
      resp
      errors {
        message
        code
      }
      sesions {
        ...sesionFragment
      }
    }
  }
`;

const UPLOAD_COVER = gql`
  mutation addCover($idSesion: ID!, $picture: Upload!) {
    addCoverSesion(idSesion: $idSesion, picture: $picture) {
      resp
      errors {
        code
        message
      }
      path
    }
  }
`;

const ADD_SESION = gql`
  ${FRAGMENTSESION}
  mutation addSesion($idEvent: ID!, $sesion: InputSesion!) {
    addSesion(idEvent: $idEvent, sesion: $sesion) {
      resp
      errors {
        code
        message
      }
      sesions {
        ...sesionFragment
      }
      sesion {
        ...sesionFragment
      }
    }
  }
`;

const EDIT_SESION = gql`
  ${FRAGMENTSESION}
  mutation editSesion($idSesion: ID!, $sesion: InputSesion!) {
    updateSesion(idSesion: $idSesion, sesion: $sesion) {
      resp
      errors {
        code
        message
      }
      sesions {
        ...sesionFragment
      }
      sesion {
        ...sesionFragment
      }
    }
  }
`;

const GETSESION = gql`
  ${FRAGMENTSESION}
  query getSesion($idSesion: ID!) {
    sesion(id: $idSesion) {
      ...sesionFragment
    }
  }
`;

@Injectable()
export class SesionService {
  constructor(private apollo: Apollo) {}
  public addSesion(
    idEvent: number,
    sesion: Isesion
  ): Observable<FetchResult<{ addSesion: ISesionResponse }>> {
    return this.apollo.mutate({
      mutation: ADD_SESION,
      variables: {
        idEvent,
        sesion: {
          duration: sesion.duration,
          nameSesion: sesion.nameSesion,
          linkRoom: sesion.linkRoom,
          startSesion: getTimestamp(sesion.startSesion),
          description: sesion.description,
        },
      },
    });
  }

  public editSesion(
    idSesion: number,
    sesion: Isesion
  ): Observable<FetchResult<{ updateSesion: ISesionResponse }>> {
    return this.apollo.mutate({
      mutation: EDIT_SESION,
      variables: {
        idSesion,
        sesion: {
          duration: sesion.duration,
          nameSesion: sesion.nameSesion,
          linkRoom: sesion.linkRoom,
          startSesion: getTimestamp(sesion.startSesion),
          description: sesion.description,
        },
      },
    });
  }

  public getSesions(
    id: number
  ): Observable<ApolloQueryResult<{ sesions: ISesionResponse }>> {
    return this.apollo.query({
      query: GETSESIONS,
      variables: {
        idEvent: Number(id),
      },
    });
  }

  public getSesion(
    idSesion: number
  ): Observable<ApolloQueryResult<{ sesion: Isesion }>> {
    return this.apollo.query({
      query: GETSESION,
      variables: {
        idSesion: Number(idSesion),
      },
    });
  }

  public uploadCover(
    file: File,
    id: number
  ): Observable<FetchResult<{ addCoverSesion: FileResponse }>> {
    return this.apollo.mutate<{ addCoverSesion: FileResponse }>({
      mutation: UPLOAD_COVER,
      variables: {
        picture: file,
        idSesion: Number(id),
      },
      context: {
        useMultipart: true,
      },
    });
  }
}
