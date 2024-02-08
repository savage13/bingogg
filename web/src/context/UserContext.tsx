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
    logout: (stay?: boolean) => Promise<void>;
    current: boolean;
}

export const UserContext = createContext<UserContext>({
    loggedIn: false,
    async checkSession() {},
    async logout() {},
    current: false,
});

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User>();
    const [current, setCurrent] = useState(false);
    const router = useRouter();

    console.log(user);

    const checkSession = useCallback(async () => {
        setCurrent(false);
        const res = await fetch('/api/me');
        if (res.ok) {
            const user = await res.json();
            setUser(user);
            setLoggedIn(true);
        } else {
            setUser(undefined);
            setLoggedIn(false);
        }
        setCurrent(true);
    }, []);
    const logout = useCallback(
        async (stay?: boolean) => {
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
            if (!stay) {
                router.push('/');
            }
        },
        [router],
    );

    useLayoutEffect(() => {
        checkSession();
    }, [checkSession]);

    return (
        <UserContext.Provider
            value={{ loggedIn, user, checkSession, logout, current }}
        >
            {children}
        </UserContext.Provider>
    );
};
