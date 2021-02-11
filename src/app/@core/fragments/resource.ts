import { gql } from 'apollo-angular';
export const RESOURCEFRAGMENT = gql`
  fragment resourceFragment on Resource {
    id
    key
    acces
    bucket
    updateResource
    type
    url
  }
`;
