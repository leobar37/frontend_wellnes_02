import { IUser } from './../../models/User';
export interface IComment {
  id?: string;
  createComment?: Date;
  updateComment?: Date;
  likes?: number;
  comment?: string;

  replies?: IComment[];

  user?: IUser;

  id_user?: number;

  id_comment?: number;

  id_bootstrap?: number;
}
export interface ICommentDisplay extends IComment {
  avatar?: string;
  displayTime?: string;
  author?: string;
}

export interface ICommentSubResponse {
  action?: string;
  comment?: Comment;
}

export type CRUD_ACTION = 'CREATE' | 'DELETE' | 'UPDATE';