import { gql, DocumentNode } from '@apollo/client';
import { IGQLMutation, IGQLQuery, IRequest } from '.';

export const QUERIES: IRequest<IGQLQuery> = {
    getTodoItemList: {
        name: 'getTodoItemList',
        query: gql`
            query getTodoItemList(
                $currentPage: Int,
                $pageSize: Int,
                $sort: CollectionSort,
                $filter: TodoItemCollectionFilter
            ) {
                getTodoItemList(
                    currentPage: $currentPage,
                    pageSize: $pageSize,
                    sort: $sort,
                    filter: $filter
                ) {
                    items {
                        id
                        created_at
                        updated_at
                        title
                    }
                    total
                }
            }
        `
    }
};

export const MUTATIONS: IRequest<IGQLMutation> = {
    addTodoItem: {
        name: 'addTodoItem',
        mutation: gql`
            mutation addTodoItem(
                $data: TodoItemInput!
            ) {
                addTodoItem(
                    data: $data
                ) {
                    id
                    created_at
                    updated_at
                    title
                }
            }
        `
    },
    updateTodoItem: {
        name: 'updateTodoItem',
        mutation: gql`
            mutation updateTodoItem(
                $id: Int!,
                $data: TodoItemInput!
            ) {
                updateTodoItem(
                    id: $id,
                    data: $data
                ) {
                    id
                    created_at
                    updated_at
                    title
                }
            }
        `
    },
    deleteTodoItem: {
        name: 'deleteTodoItem',
        mutation: gql`
            mutation deleteTodoItem(
                $id: Int!
            ) {
                deleteTodoItem(
                    id: $id
                ) {
                    id
                }
            }
        `
    }
};

export const SUBSCRIPTIONS: IRequest<IGQLQuery> = {
    watchTodoItemList: {
        name: 'watchTodoItemList',
        query: gql`
            subscription watchTodoItemList(
                $currentPage: Int,
                $pageSize: Int,
                $sort: CollectionSort,
                $filter: TodoItemCollectionFilter
            ) {
                watchTodoItemList(
                    currentPage: $currentPage,
                    pageSize: $pageSize,
                    sort: $sort,
                    filter: $filter
                ) {
                    items {
                        id
                        created_at
                        updated_at
                        title
                    }
                    total
                }
            }
        `
    }
};
