import { gql } from '@apollo/client';
import { IGQLMutation, IRequest } from '.';

export const MUTATIONS: IRequest<IGQLMutation> = {
    login: {
        name: 'login',
        mutation: gql`
            mutation login {
                login {
                    token
                }
            }
        `
    }
};
