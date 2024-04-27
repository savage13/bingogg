'use client';
import {
    createContext,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from 'react';
import { User } from '../types/User';
import { useRouter } from 'next/navigation';
import { alertError } from '../lib/Utils';

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
    const [checkDone, setCheckDone] = useState(false);
    const [user, setUser] = useState<User>();
    const router = useRouter();

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
        setCheckDone(true);
    }, []);
    const logout = useCallback(async () => {
        const res = await fetch('api/logout', { method: 'POST' });
        if (!res.ok) {
            if (res.status === 500) {
                alertError(
                    'Unable to process logout request. Try again in a few moments.',
                );
                return;
            }
        }
        setUser(undefined);
        setLoggedIn(false);
        router.push('/');
    }, [router]);

    useLayoutEffect(() => {
        checkSession();
    }, [checkSession]);

    if (!checkDone) {
        return null;
    }

    return (
        <UserContext.Provider value={{ loggedIn, user, checkSession, logout }}>
            {children}
        </UserContext.Provider>
    );
};
