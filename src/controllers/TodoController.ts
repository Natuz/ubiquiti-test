import { IBaseEntityInput } from '../interfaces/base';
import BaseController from './BaseController';
import { Todo as TodoModel } from '../models';

export default class TodoController extends BaseController {
    constructor(props: IBaseEntityInput = {}) {
        super(props);
        this.Model = TodoModel;
        this.relatedFields = [];
    }
}
