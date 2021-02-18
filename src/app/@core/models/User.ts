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
}

export const examplesUser: IUser[] = [
  {
    id: 1,
    email: 'usatloqueando@gmail.com',
    password: 'holawenas',
    code: '564asas',
    phone: '96008206',
    name: 'Elmer Joselito',
    lastName: 'León Barboza',
    birth: new Date(),
    image: 'assets/img/profileexample.jpg',
  },
];
