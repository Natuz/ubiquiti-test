import { gql } from '@apollo/client';
import Todo from './types/Todo';
import User from './types/User';

export const defs = gql`
    type Query {
        "Ping server."
        ping: String!
    }

    type Subscription {
        "Ping server."
        ping: String!
    }

    type Mutation {
        "Ping server."
        ping: String!
    }

    "Base entity interface."
    interface BaseEntity {
        id: Int!
        created_at: String!
        updated_at: String!
    }

    "Return a collection of entities."
    interface Collection {
        count: Int!
        limit: Int!
        current_page: Int!
        has_more: Boolean!
        total: Int!
    }

    "Collection sort input type."
    input CollectionSort {
        field: String
        order: SortOrder
    }

    "Collection sort order."
    enum SortOrder {
        ascend
        descend
    }

    enum FilterOperand {
        equal
        like
    }
`;

export const typeDefs = [
    defs,
    Todo,
    User
];
