import graphqlFields from 'graphql-fields';
import BaseControllerInterface from './BaseControllerInterface';
import {
    IBaseEntityInput,
    IBaseEntityFilterInput,
    IPaginatedResponse,
    IBaseEntitySortInput,
    IBaseEntityFilterInputOperand
} from '../interfaces/base';
import { model as emptyModel, ObjectRelationalMappingModel } from '@/models/utils/bookshelf';

export default abstract class BaseController<IncomingPropsType extends IBaseEntityInput = any> implements BaseControllerInterface {
    protected readonly incomingProps: IncomingPropsType;

    protected readonly pageSize: number;

    protected readonly currentPage: number;

    protected readonly filter?: IBaseEntityFilterInput;

    protected readonly filterOperand?: IBaseEntityFilterInputOperand;

    protected sort?: IBaseEntitySortInput;

    protected readonly requestedFields?: any;

    protected readonly context?: any;

    protected id?: number;

    protected Model: ObjectRelationalMappingModel = emptyModel('', '');

    protected relatedFields: string[] = [];

    protected obligatoryRelatedFields: any[] = [];

    constructor(props: IncomingPropsType) {
        this.incomingProps = props; // assign all the incoming props to a variable so we can manipulate them within any extended class

        const {
            id,
            pageSize = 10,
            currentPage = 1,
            filter,
            filterOperand = '=',
            sort,
            info = null,
            context
        } = props;

        this.id = id;
        this.pageSize = pageSize >= 1 && pageSize <= 100 ? pageSize : 10;
        this.currentPage = currentPage;
        this.filter = filter;
        this.filterOperand = filterOperand;
        this.sort = sort;
        this.requestedFields = info;
        this.context = context;
    }

    /**
     * Get single entity.
     */
    public async get<T>(): Promise<T | null> {
        if (!this.id) {
            this.throwFormattedError('entity ID is not set!');
        }

        try {
            const requestedFields = this.requestedFields ? graphqlFields(this.requestedFields) : null;
            const relatedFields = this.getModelRelatedFields(requestedFields);
            const model = await this.getModel().fetch({ withRelated: relatedFields });

            return this.decorateEntity(model.toJSON());
        } catch (error) {
            if (this.isEmptyResponse(error)) {
                return null;
            }

            this.logError(error, 'get');
            throw error;
        }
    }

    /**
     * Get entity list.
     */
    public async getList<T>(): Promise<IPaginatedResponse<T>> {
        try {
            const requestedFields = this.requestedFields ? graphqlFields(this.requestedFields) : null;
            const relatedFields = this.getModelRelatedFields(requestedFields?.items);
            const collection = await this.getModel().fetchPage({
                pageSize: this.pageSize,
                page: this.currentPage,
                withRelated: relatedFields
            });

            return this.decorateEntityList(this.paginatedResponse<T>(collection));
        } catch (error) {
            this.logError(error, 'getList');
            throw error;
        }
    }

    /**
     * Create entity.
     */
    public async create<T>(data: any): Promise<T | null> {
        try {
            return (await this.getModel().save(data, { method: 'insert' })).toJSON();
        } catch (error) {
            if (this.isDuplicateEntry(error)) {
                throw new Error('Such entity already exists!');
            }

            if (this.isEmptyResponse(error)) {
                return null;
            }

            this.logError(error, 'create');
            throw error;
        }
    }

    /**
     * Update entity.
     */
    public async update<T>(data: any): Promise<T | null> {
        if (!this.id) {
            this.throwFormattedError('entity ID is not set!');
        }

        try {
            const model = await this.getModel().fetch();

            return (await model.save(data, { method: 'update' })).toJSON();
        } catch (error) {
            if (this.isEmptyResponse(error)) {
                return null;
            }

            if (this.isDuplicateEntry(error)) {
                throw new Error('Such entity already exists!');
            }

            this.logError(error, 'update');
            throw error;
        }
    }

    /**
     * Delete entity.
     */
    public async delete<T>(): Promise<T | null> {
        if (!this.id) {
            this.throwFormattedError('entity ID is not set');
        }

        try {
            const item = await this.get<T>();

            await this.getModel().destroy();

            return item;
        } catch (error) {
            if (this.isEmptyResponse(error) || this.isNoRowsDeletedResponse(error)) {
                return null;
            }

            this.logError(error, 'delete');
            throw error;
        }
    }

    /**
     * Apply decorations to when getting signle entity.
     */
    protected decorateEntity = (data: any): any => data;

    /**
     * Apply decorations to when getting entity list.
     */
    protected decorateEntityList = (data: any): any => data;

    /**
     * Construct a list of related fields.
     */
    protected getModelRelatedFields(fields: any): string[] {
        const getRelatedFields = (parent: any, prefix = ''): string[] => {
            let related: any[] = [];
            const relatedDeeper: string[] = [];

            Object.keys(parent).forEach((field: any) => {
                if (Object.keys(parent[field]).length > 0) {
                    related.push(`${prefix}${field}`);
                    relatedDeeper.push(field);
                } else if (prefix === '') {
                    related.push(`${prefix}${field}`);
                }
            });

            if (relatedDeeper.length > 0) {
                relatedDeeper.forEach((child: any) => {
                    related = [...related, ...getRelatedFields(parent[child], `${prefix}${child}.`)];
                });
            }

            return related;
        };

        return fields
            ? getRelatedFields(fields).filter((field) => this.relatedFields.includes(field))
            : [];
    }

    /**
     * Get model instance.
     */
    protected getModel(props: { [key: string]: string | number | boolean } = {}) {
        if (!this.Model) this.throwFormattedError('model is not set!');

        const modelInstance = this.id
            ? new this.Model({ id: this.id })
            : new this.Model(props);

        if (this.sort) {
            modelInstance.orderBy(this.sort.field, this.sort.order);
        }

        return this.applyFilters(modelInstance, this.filter);
    }

    /**
     * Apply filters to initialized model instance.
     */
    protected applyFilters(modelInstance: any, filters?: IBaseEntityFilterInput) {
        if (filters) {
            Object.keys(filters).forEach((filterKey) => {
                if (filters[filterKey]) {
                    if (filters[filterKey].length > 1) {
                        modelInstance.where(filterKey, 'in', filters[filterKey]);
                    } else {
                        const filterValue = filters[filterKey][0];
                        const operand = typeof filterValue === 'boolean' ? '=' : this.filterOperand;
                        const value = operand === 'like' ? `%${filterValue}%` : filterValue;

                        modelInstance.where(filterKey, operand, value);
                    }
                }
            });
        }

        return modelInstance;
    }

    /**
     * Create paginated response from collection.
     */
    protected paginatedResponse = <T>(collection?: any): IPaginatedResponse<T> => {
        if (!collection) {
            return {
                items: [],
                count: 0,
                limit: this.pageSize,
                current_page: this.currentPage,
                has_more: false,
                total: 0
            };
        }

        const items = collection.toJSON();

        return {
            items,
            count: items.length,
            limit: collection.pagination.pageSize,
            current_page: collection.pagination.page,
            has_more: collection.pagination.pageCount > collection.pagination.page,
            total: collection.pagination.rowCount
        };
    }

    /**
     * Unify error response format.
     */
    protected throwFormattedError = (message: string): void => {
        throw new Error(`Cannot get ${this.constructor.name} instance: ${message}`);
    }

    protected isEmptyResponse = (error: any): boolean => error.message === 'EmptyResponse';

    protected isNoRowsUpdatedResponse = (error: any): boolean => error.message === 'No Rows Updated';

    protected isNoRowsDeletedResponse = (error: any): boolean => error.message === 'No Rows Deleted';

    protected isDuplicateEntry = (error: any): boolean => error.code === 'ER_DUP_ENTRY';

    protected logError(error: any, action: string): void {
        console.log(`${this.constructor.name} :: ${action}`, error);
    }
}
