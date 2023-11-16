import { gql } from '@apollo/client';

const Todo = gql`
    extend type Query {
        getTodoItem(id: Int!): TodoItem
        getTodoItemList(
            pageSize: Int = 10,
            currentPage: Int = 1,
            sort: CollectionSort
            filter: TodoItemCollectionFilter,
            filterOperand: FilterOperand
        ): TodoItemCollection!
    }

    extend type Subscription {
        watchTodoItemList(
            pageSize: Int = 10,
            currentPage: Int = 1,
            sort: CollectionSort
            filter: TodoItemCollectionFilter,
            filterOperand: FilterOperand
        ): TodoItemCollection!
    }

    extend type Mutation {
        addTodoItem(data: TodoItemInput!): TodoItem
        updateTodoItem(id: Int!, data: TodoItemInput!): TodoItem
        deleteTodoItem(id: Int!): TodoItem
    }

    type TodoItem implements BaseEntity {
        id: Int!
        created_at: String!
        updated_at: String!
        title: String!
    }

    type TodoItemCollection implements Collection {
        items: [TodoItem]!
        count: Int!
        limit: Int!
        current_page: Int!
        has_more: Boolean!
        total: Int!
    }

    input TodoItemInput {
        title: String!
    }

    input TodoItemCollectionFilter {
        title: [String!]
    }
`;

export default Todo;
