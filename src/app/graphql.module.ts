import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';

import { environment } from '../environments/environment';
import { OperationDefinitionNode } from 'graphql';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = `${environment.apiUrl}/graphql`; // <-- add the URL of the GraphQL server here
const uriWs = `ws://${environment.hostSubs}/suscriptions`;
import { setContext } from '@apollo/client/link/context';
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const ws = new WebSocketLink({
    uri: uriWs,
    options: {
      reconnect: true
    }
  });
  const http = httpLink.create({
    uri: uri
  });
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(
        query
      ) as OperationDefinitionNode;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    // NOTE : be careful in the order
    ws,
    http
  );
  return {
    link: link,
    cache: new InMemoryCache()
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
