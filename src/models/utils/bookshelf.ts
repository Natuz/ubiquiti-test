import { knex } from './knex';
import bookshelf, { Model as BookshelfModel } from 'bookshelf';

/**
 * Initialize ORM model.
 */
export const model = (
    modelName: string,
    tableName: string,
    options: Record<string, any> = {}
): typeof BookshelfModel => bookshelf(knex).model(
    modelName,
    {
        tableName,
        hasTimestamps: true,
        ...options
    }
);

export type ObjectRelationalMappingModel = typeof BookshelfModel;
