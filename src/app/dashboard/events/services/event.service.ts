import { FileResponse } from '@core/models/reponses/response';
import { FetchResult, ApolloQueryResult } from '@apollo/client/core';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
import { DetailEventAllResponse } from '@core/models/eventmodels/event.response';
import { EventResponse } from 'src/app/@core/models/eventmodels/event.response';
import { IEvent } from 'src/app/@core/models/eventmodels/event.model';
import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { FRAGMENTSESION } from './sesion.service';
import { tap, catchError } from 'rxjs/operators';
const EVENTFRAGMENT = gql`
  fragment eventFragment on Event {
    name
    id
    published
    capacityAssistant
    publishedDate
    includeComments
    description
    includeVideo
    id_resource
    eventCover
    id_comment
    video {
      url
    }
  }
`;

const CREATEEVENT = gql`
  ${EVENTFRAGMENT}
  mutation createEvent($eventInput: InputEvent!) {
    createEvent(event: $eventInput) {
      resp
      event {
        ...eventFragment
      }
      errors {
        code
        message
      }
    }
  }
`;

const EDITEVENT = gql`
  ${EVENTFRAGMENT}
  mutation editEvent($id: Int!, $event: InputEvent!) {
    editEvent(id: $id, event: $event) {
      resp
      event {
        ...eventFragment
      }
      errors {
        code
        message
      }
    }
  }
`;
const UPLOADCOVEREVENT = gql`
  mutation addImageEvent($idEvent: Int!, $picture: Upload!) {
    addCoverEvent(idevent: $idEvent, picture: $picture) {
      resp
      errors {
        code
        message
      }
      path
    }
  }
`;

const GETEVENT = gql`
  ${EVENTFRAGMENT}
  ${FRAGMENTSESION}
  query getEvent($id: ID!) {
    event(id: $id) {
      ...eventFragment
      sesions {
        ...sesionFragment
      }
    }
  }
`;

const GETEVENTWITHSESION = gql`
  ${FRAGMENTSESION}
  ${EVENTFRAGMENT}
  query getEvent($id: ID!) {
    event(id: $id) {
      ...eventFragment
      sesions {
        ...sesionFragment
      }
    }
  }
`;
const GETEVENTS = gql`
  ${EVENTFRAGMENT}
  query getEvents {
    getEvents {
      ...eventFragment
    }
  }
`;

const GETEVENTSOFUSER = gql`
  ${FRAGMENTSESION}
  ${EVENTFRAGMENT}
  query getEvents($idUser: Int!) {
    getEventsOfUser(idUser: $idUser) {
      resp
      errors {
        code
        message
      }
      events {
        ...eventFragment
        sesions {
          ...sesionFragment
          event {
            ...eventFragment
          }
        }
      }
    }
  }
`;

@Injectable()
export class EventService {
  constructor(private apollo: Apollo) {}
  public addEvent(
    event: IEvent
  ): Observable<FetchResult<{ createEvent: EventResponse }>> {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    return this.apollo
      .mutate<{ createEvent: EventResponse }>({
        mutation: CREATEEVENT,
        variables: {
          eventInput: {
            name: event.name,
            video: event.video,
            capacityAssistant: event.capacityAssistant,
            published: EventState[event.published],
            description: event.description,
            publishedDate: publishDate,
            includeComments: event.includeComments,
            cloudinarySource: event.cloudinarySource,
            id_resource: Number(event.id_resource),
            includeVideo: event.includeVideo,
          },
        },
      })
      .pipe(tap(console.log));
  }

  /*=============================================
 =            get event of user            =
 =============================================*/

  public getEventsOfUser(idUser: number) {
    return this.apollo.watchQuery<{ getEventsOfUser: DetailEventAllResponse }>({
      query: GETEVENTSOFUSER,
      variables: {
        idUser,
      },
    });
  }
  public uploadFile(
    file: File,
    id: number
  ): Observable<FetchResult<{ addCoverEvent: FileResponse }>> {
    return this.apollo.mutate<{ addCoverEvent: FileResponse }>({
      mutation: UPLOADCOVEREVENT,
      variables: {
        picture: file,
        idEvent: Number(id),
      },
      context: {
        useMultipart: true,
      },
    });
  }

  public getEvent(
    id: number,
    includeSesions?: boolean
  ): Observable<ApolloQueryResult<{ event: IEvent }>> {
    return this.apollo
      .query<{ event: IEvent }>({
        query: includeSesions ? GETEVENTWITHSESION : GETEVENT,
        variables: {
          id: id,
        },
      })
      .pipe(tap((data) => {}));
  }
  // get events
  public getEvents() {
    return this.apollo
      .query<{ getEvents: IEvent[] }>({
        query: GETEVENTS,
      })
      .pipe(
        catchError((err) => {
          console.log('errores');

          console.log(err);
          return of(err);
        })
      );
  }

  // edit event in server
  public editEvent(
    id: number,
    event: IEvent
  ): Observable<FetchResult<{ editEvent: EventResponse }>> {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    return this.apollo.mutate<{ editEvent: EventResponse }>({
      mutation: EDITEVENT,
      variables: {
        event: {
          name: event.name,
          capacityAssistant: event.capacityAssistant,
          published:
            typeof event.published == 'number'
              ? EventState[event.published]
              : event.published,
          description: event.description,
          publishedDate: publishDate,
          includeComments: event.includeComments,
          cloudinarySource: event.cloudinarySource,
          includeVideo: event.includeVideo,
        },
        id: Number(id),
      },
    });
  }
}
