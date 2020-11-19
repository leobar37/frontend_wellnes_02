export interface IUser {
  id?: string;
  email?: string;
  password?: string;
  code?: string;
  phone?: string;
  name?: string;
  lastName?: string;
  rol?: string[];
  birth?: Date;
}

export class User {
  id: string;
}
