import { IBaseItem } from ".";

export interface ITodoItem extends IBaseItem {
    title: string;
}

export interface ITodoItemInput {
    title: string;
}
