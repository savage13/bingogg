'use client';
import {
    createContext,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import { User } from '../types/User';

interface UserContext {
    loggedIn: boolean;
    user?: User;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

export const UserContext = createContext<UserContext>({
    loggedIn: false,
    async checkSession() {},
    async logout() {},
});

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User>();

    const checkSession = useCallback(async () => {
        const res = await fetch('/api/me');
        if (res.ok) {
            const user = await res.json();
            setUser(user);
            setLoggedIn(true);
        } else {
            setUser(undefined);
            setLoggedIn(false);
        }
    }, []);
    const logout = useCallback(async () => {
        const res = await fetch('api/logout', { method: 'POST' });
        if (!res.ok) {
            if (res.status === 500) {
                //TODO: handle error
                return;
            }
        }
        setUser(undefined);
        setLoggedIn(false);
    }, []);

    useLayoutEffect(() => {
        checkSession();
    }, [checkSession]);

    return (
        <UserContext.Provider value={{ loggedIn, user, checkSession, logout }}>
            {children}
        </UserContext.Provider>
    );
};
