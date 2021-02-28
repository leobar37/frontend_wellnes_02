import { ICredit } from './credits.model';
import { IEvent } from '@core/models/eventmodels/event.model';
export interface IUser {
  id?: number;
  email?: string;
  password?: string;
  code?: string;
  phone?: string;
  name?: string;
  lastName?: string;
  rol?: string[];
  birth?: Date;
  image?: string;
  description?: string;
  eventsCreated?: IEvent[];
  getCompleteName?: string;
  sponsor?: string;
  create?: Date;
  comfirmed?: boolean;
  credit?: ICredit;
}
