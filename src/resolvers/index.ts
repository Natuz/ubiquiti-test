import { ITodoItem, ITodoItemInput, IUserToken } from "@/interfaces";
import { IBaseEntityInput, IBaseItemInput, IPaginatedResponse } from "@/interfaces/base";
import TodoController from "@/controllers/TodoController";
import UserController from "@/controllers/UserController";

/**
 * TODO
 * - add Redis as a caching layer standing between resolver and model
 */

const ping = () => `pong! (${new Date().toTimeString()})`; // just to test if server is responding

const SUBSCRIPTION_TIMEOUT = 1000; // ms

export const resolvers = {
    SortOrder: {
        ascend: 'ASC',
        descend: 'DESC'
    },

    Query: {
        ping,

        getTodoItem: async (
            _: any, { id }, context: any, info: any
        ): Promise<ITodoItem | null> => new TodoController({ id, info, context }).get<ITodoItem>(),

        getTodoItemList: async (
            _: any, {
                pageSize, currentPage, sort, filter, filterOperand
            }: IBaseEntityInput, context: any, info: any
        ): Promise<IPaginatedResponse<ITodoItem>> => new TodoController({
            info, context, pageSize, currentPage, sort, filter, filterOperand
        }).getList<ITodoItem>(),
    },

    Mutation: {
        ping,

        addTodoItem: async (
            _: any, { data }: IBaseItemInput<ITodoItemInput>, context: any, info: any
        ): Promise<ITodoItem | null> => new TodoController({ info, context }).create<ITodoItem>(data),

        updateTodoItem: async (
            _: any, { id, data }: { id: number, data: IBaseItemInput<ITodoItemInput> }, context: any, info: any
        ): Promise<ITodoItem | null> => new TodoController({ id, info, context }).update<ITodoItem>(data),

        deleteTodoItem: async (
            _: any, { id }, context: any, info: any
        ): Promise<ITodoItem | null> => new TodoController({ id, info, context }).delete<ITodoItem>(),

        login: async (): Promise<IUserToken | null> => new UserController().login()
    },

    Subscription: {
        ping: {
            async *subscribe() {
                while(true) {
                    yield { ping: ping() };

                    await new Promise(resolve => setTimeout(resolve, SUBSCRIPTION_TIMEOUT));
                }
            }
        },

        watchTodoItemList: {
            async *subscribe(
                _: any, {
                    pageSize, currentPage, sort, filter, filterOperand
                }: IBaseEntityInput, context: any, info: any
            ) {
                while (true) {
                    yield { watchTodoItemList: await new TodoController({
                        info, context, pageSize, currentPage, sort, filter, filterOperand
                    }).getList<ITodoItem>() };

                    await new Promise(resolve => setTimeout(resolve, SUBSCRIPTION_TIMEOUT));
                }
            }
        }
    }
};
