import { typID } from '@core/models/types';
export type typeRender = 'FLOAT' | 'COMPLETE' | 'MOBILE';
export type ChatAvatar = {
  active?: boolean;
  avatar?: string;
  notifications?: number;
  name?: string;
};

export interface IlistMessageItem {
  id: typID;
  name?: string;
  message: string;
  time?: Date;
  avatar: ChatAvatar;
}

export interface IConversationItem {
  reverse: boolean;
  name: string;
  message: string;
  time: Date;
  avatar: ChatAvatar;
}
