import { IPaginatedResponse } from '../interfaces/base';

export default interface BaseControllerInterface {
    /**
     * Get single entity.
     */
    get<T>(): Promise<T | null>;

    /**
     * Get entity list.
     */
    getList<T>(): Promise<IPaginatedResponse<T>>;

    /**
     * Create entity.
     */
    create<T>(data: any): Promise<T | null>;

    /**
     * Update entity.
     */
    update<T>(data: any): Promise<T | null>;

    /**
     * Delete entity.
     */
    delete<T>(): Promise<T | null>;
};
