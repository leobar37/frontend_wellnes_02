import { EventResponse } from '../../../@core/models/eventmodels/event.response';
import { IEvent } from './../../../@core/models/eventmodels/event.model';
import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';

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
      }
      errors {
        code
        message
      }
    }
  }
`;
/**
 *   @Field()
  name!: string;

  @Field((type) => Date)
  startEvent!: Date;

  @Field((type) => GraphQLJSON)
  description!: string;

  @Field((type) => Int, { nullable: true })
  capacityAssistant!: number;

  @Field((type) => Boolean, { nullable: true })
  published!: boolean;

  @Field((type) => Date, { nullable: true })
  publishedDate!: Date;
 */
@Injectable()
export class EventService {
  constructor(private apollo: Apollo) {}
  addEvent(event: IEvent) {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    this.apollo
      .mutate<EventResponse>({
        mutation: CREATEEVENT,
        variables: {
          eventInput: {
            name: event.name,
            startEvent: event.startEvent.getTime(),
            capacityAssistant: event.capacityAssistant,
            published: event.published || null,
            description: event.description,
            publishedDate: publishDate,
          },
        },
      })
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
