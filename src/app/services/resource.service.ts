import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { RESOURCEFRAGMENT } from '@fragments/resource';
import { ResourceResponse } from '@models/reponses/response';
import { IResource } from '@models/eventmodels/resource.model';
const CREATE_RESOURCE = gql`
  ${RESOURCEFRAGMENT}
  mutation addResource($resource: InputResource!) {
    createResource(resource: $resource) {
      ...resourceFragment
    }
  }
`;

const EDIT_RESOURCE = gql`
  ${RESOURCEFRAGMENT}
  mutation editResource($resource: InputResource!, $idResource: Int!) {
    editResource(resource: $resource, idResource: $idResource) {
      resp
      resource {
        ...resourceFragment
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private apollo: Apollo) {}

  public createResource(resource: IResource) {
    return this.apollo
      .mutate<{ createResource: IResource }>({
        mutation: CREATE_RESOURCE,
        variables: {
          resource: {
            ...resource,
          },
        },
      })
      .toPromise();
  }

  public editResource(resource: IResource, idResource: number) {
    return this.apollo
      .mutate<{ editResource: ResourceResponse }>({
        mutation: EDIT_RESOURCE,
        variables: {
          resource: {
            ...resource,
          },
          idResource: idResource,
        },
      })
      .toPromise();
  }
}
