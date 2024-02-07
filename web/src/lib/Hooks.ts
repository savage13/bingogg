'use client';
import { use } from 'react';
import useSWR from 'swr';

export const useApi = <T>(route: string, immutable?: boolean) => {
    const options = {
        revalidateIfStale: !immutable,
        revalidateOnFocus: !immutable,
        revalidateOnReconnect: !immutable,
    };
    return useSWR<T>(
        route,
        (path) =>
            fetch(path).then((res) => {
                if (!res.ok) {
                    if (res.status === 404) {
                        return undefined;
                    }
                }
                return res.json();
            }),
        options,
    );
};

export const useFetch = <T>(path: string) => {
    const url = process.env.API_PATH ? `${process.env.API_PATH}${path}` : path;
    const doFetch = async () => {
        const res = await fetch(url);
        if (!res.ok) {
            return undefined;
        }
        return res.json() as T;
    };
    return use(doFetch());
};
