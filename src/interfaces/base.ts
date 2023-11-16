export interface IBaseItem {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface IBaseItemInput<T = any> {
    data: T;
}

export interface IPaginatedResponse<T = any> {
    items: T[];
    count: number;
    limit: number;
    current_page: number;
    has_more: boolean;
    total: number;
}

export interface IBaseEntityInput<
    Filter extends IBaseEntityFilterInput = IBaseEntityFilterInput,
    Sort extends IBaseEntitySortInput = IBaseEntitySortInput
> {
    id?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: Filter;
    filterOperand?: IBaseEntityFilterInputOperand;
    sort?: Sort;
    info?: any;
    context?: any;
}

export interface IBaseEntityFilterInput {
    [key: string]: string[] | number[] | boolean[];
}

export interface IBaseEntitySortInput {
    field: string;
    order: SortOrder;
}

export type IBaseEntityFilterInputOperand = '=' | 'like';

export type SortOrder = 'ASC' | 'DESC';
