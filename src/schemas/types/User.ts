import { gql } from '@apollo/client';

const User = gql`
    extend type Mutation {
        login: UserToken
    }

    type UserToken {
        token: String!
    }
`;

export default User;
