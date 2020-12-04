import { IEvent } from './event.model';
import { NormalResponse } from './../reponses/response';

export interface EventResponse extends NormalResponse {
  event?: IEvent;
}
