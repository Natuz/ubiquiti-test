require('dotenv').config();

import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { IUserToken } from '@/interfaces';

export default class TodoController {
    public async login(): Promise<IUserToken> {
        const secret = process.env.JWT_SECRET || 'jwtsecret';

        return {
            token: jwt.sign({ name: faker.person.firstName() }, secret )
        };
    }
}
