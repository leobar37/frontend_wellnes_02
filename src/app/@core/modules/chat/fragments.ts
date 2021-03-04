import { gql } from 'apollo-angular';

export const MESSAGE_VIEW = gql`
  fragment messageView on MessageView {
    id
    created
    read
    message
    avatar
    name
    id_conversation
    id_creator
  }
`;
