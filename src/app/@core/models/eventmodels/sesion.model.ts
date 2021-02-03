import { IEvent } from '@core/models/eventmodels/event.model';
export interface Isesion {
  id?: number;
  duration: number;
  linkRoom?: string;
  startSesion?: Date;
  description?: string;
  createdSesion?: Date;
  nameSesion?: string;
  sesionCover?: string;
  event?: IEvent;
  video?: string;
}
