import { MESSAGE_VIEW } from './../fragments';
import { JwtService } from '@services/jwt.service';
import {
  IUserChat,
  IRecentMessages,
  IConversation,
  IMessage
} from './../model';
import { tap, pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '@core/models/User';
const VIEW_PRINCIPAL = gql`
  query viewChatPrincipal($idUser: Int!) {
    recentMessages(idUser: $idUser) {
      id_user
      avatar
      name
      id_conversation
      count_messages
      last_message
      time_message
      unread_messages
    }
    getActiveUser(idUser: $idUser) {
      id
      name
      lastName
      online
      description
    }
  }
`;

const GET_CONVERSATION = gql`
  ${MESSAGE_VIEW}
  query conversation($id: ID!) {
    conversation(id: $id) {
      id
      messages {
        ...messageView
      }
    }
  }
`;
const CREATE_CONVERSATION = gql`
  ${MESSAGE_VIEW}
  mutation createConversation($idResponse: Int!, $idRemitent: Int!) {
    createConversation(idRemitent: $idResponse, idResponse: $idRemitent) {
      id
      created
      messages {
        ...messageView
      }
    }
  }
`;

@Injectable()
export class ChatDataService {
  private activeUsersSubject$ = new BehaviorSubject<IUserChat[]>([]);
  private recentMessagesSubject$ = new BehaviorSubject<IRecentMessages[]>([]);
  private messageConversationSubject$ = new BehaviorSubject<IMessage[]>([]);

  private _user: IUser;
  // expose
  public activeUsers$ = this.activeUsersSubject$.asObservable();
  public recentMessages$ = this.recentMessagesSubject$.asObservable();
  public messages$ = this.messageConversationSubject$.asObservable();
  constructor(private apollo: Apollo, private jwtService: JwtService) {}

  public init() {
    this.getViewPrincipal(this.user.id);
  }

  public createConversation(idResponse: number): Observable<IConversation> {
    const user = this.user;
    return this.apollo
      .mutate({
        mutation: CREATE_CONVERSATION,
        variables: {
          idRemitent: Number(user.id),
          idResponse: idResponse
        }
      })
      .pipe(
        tap((data) => {
          const messages = _.get(data, 'data.createConversation.messages');
          this.messageConversationSubject$.next(
            this.transformMessage(messages)
          );
        }),
        pluck('data', 'createConversation')
      );
  }
  public getConversation(id: number): Observable<IConversation> {
    return this.apollo
      .query({ query: GET_CONVERSATION, variables: { id } })
      .pipe(
        tap((data) => {
          const messages = _.get(data, 'data.conversation.messages');
          console.log(messages);

          console.log(this.transformMessage(messages));

          this.messageConversationSubject$.next(
            this.transformMessage(messages)
          );
        }),
        pluck('data', 'conversation')
      );
  }
  private transformMessage(messages: IMessage[]) {
    return messages.map((msg) => ({
      ...msg,
      reverse: msg.id_creator == this.user.id
    }));
  }
  get user() {
    if (this._user) {
      return this._user;
    } else {
      this._user = this.jwtService.getUserOfToken();
      return this._user;
    }
  }
  getViewPrincipal(idUser: number) {
    this.apollo
      .query({ query: VIEW_PRINCIPAL, variables: { idUser: idUser } })
      .pipe(
        pluck('data'),
        map((source) => {
          const activeUsers = _.get(source, 'getActiveUser') as IUserChat[];
          const recentMessages = _.get(
            source,
            'recentMessages'
          ) as IRecentMessages[];
          this.activeUsersSubject$.next(activeUsers);
          this.recentMessagesSubject$.next(recentMessages);
          return;
        })
      )
      .subscribe();
  }
}
