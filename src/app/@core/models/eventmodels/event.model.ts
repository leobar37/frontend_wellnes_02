import { IResource } from '@models/eventmodels/resource.model';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { SafeUrl } from '@angular/platform-browser';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
export interface IEvent {
  id?: number;
  name?: string;
  endEvent?: Date;
  description?: string;
  capacityAssistant?: number;
  createEvent?: Date;
  published?: EventState;
  publishedDate?: Date;
  includeComments?: boolean;
  eventCover: string | SafeUrl;
  sesions?: Isesion[];
  video?: IResource;
  cloudinarySource?: string;
  id_resource?: number;
  includeVideo?: boolean;
}
