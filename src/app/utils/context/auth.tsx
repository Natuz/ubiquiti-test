import { createContext, useContext, useState } from 'react';
import Lodash from 'lodash'
import { IUserToken } from '@/interfaces';
import { MUTATIONS } from '@/app/utils/query/user';
import { useMutation } from '@/app/utils/hooks/query';
import { parseJwt } from '@/app/utils/jwt';

interface ICurrentUser {
    name: string;
}

const defaultCurrentUser: {
    currentUser: ICurrentUser | null;
    login: () => void;
    loading: boolean;
} = {
    currentUser: null,
    login: () => { },
    loading: false
}

const AuthContext = createContext(defaultCurrentUser);

export const AuthProvider = ({ children }) => {
    /**
     * TODO
     * - check auth token existence in cookies and provide 'currentUser' based on it
     * - add auth token to cookies when logging in
     * - add logout functionality
     */

    const { mutateFunction: loginUser, loading } = useMutation<IUserToken>(MUTATIONS.login);

    const [user, setUser] = useState<ICurrentUser | null>(null);

    const login = async () => {
        const { token } = await loginUser();
        const user = Lodash.pick(parseJwt(token), ['name']);

        setUser(user);
    };

    return <AuthContext.Provider value={{ currentUser: user, login, loading }}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
