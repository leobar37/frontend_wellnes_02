import { FileResponse } from './../../../@core/models/reponses/response';
import { FetchResult } from '@apollo/client/core';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';

import { EventResponse } from 'src/app/@core/models/eventmodels/event.response';
import { IEvent } from './../../../@core/models/eventmodels/event.model';
import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

const CREATEEVENT = gql`
  mutation createEvent($eventInput: InputEvent!) {
    createEvent(event: $eventInput) {
      resp
      event {
        name
        id
        published
        startEvent
        capacityAssistant
        publishedDate
        includeComments
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

@Injectable()
export class EventService {
  constructor(private apollo: Apollo) {}
  addEvent(
    event: IEvent
  ): Observable<FetchResult<{ createEvent: EventResponse }>> {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    return this.apollo.mutate<{ createEvent: EventResponse }>({
      mutation: CREATEEVENT,
      variables: {
        eventInput: {
          name: event.name,
          startEvent: event.startEvent.getTime(),
          capacityAssistant: event.capacityAssistant,
          published: EventState[event.published],
          description: event.description,
          publishedDate: publishDate,
          includeComments: event.includeComments,
        },
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
}
