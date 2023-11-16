import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache, split, HttpLink, DocumentNode } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

export interface IGQLQuery {
    name: string;
    query: DocumentNode;
}

export interface IGQLMutation {
    name: string;
    mutation: DocumentNode;
}

export interface IRequest<T> {
    [key: string]: T;
}

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:3000/api/graphql'
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'ws://localhost:3000/api/graphql'
    })
);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});
