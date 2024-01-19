'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useLayoutEffect } from 'react';
import { UserContext } from '../../context/UserContext';

const readableScopes = {};

export default function Authorize({
    searchParams,
}: {
    searchParams: { [key: string]: string };
}) {
    const { user, current } = useContext(UserContext);
    const router = useRouter();

    useLayoutEffect(() => {
        if (current && !user) {
            router.push('/login');
        }
    }, [user, current, router]);

    if (!user) {
        return null;
    }

    const { clientId, scopes } = searchParams;

    if (!clientId) {
        return 'missing client id';
    }
    if (typeof clientId !== 'string') {
        return 'invalid client id';
    }
    if (!scopes) {
        return 'no scopes specified';
    }
    if (typeof scopes !== 'string') {
        return 'invalid scope list';
    }

    const scopeList = scopes.split(' ');

    return (
        <div
            className="flex h-screen items-center justify-center bg-repeat"
            style={{
                background:
                    'repeating-conic-gradient(black 0% 25%, maroon 0% 50%) 50% / 500px 500px',
            }}
        >
            <div className="w-96 rounded-lg border border-gray-500 bg-black bg-opacity-80 text-center shadow-md">
                <div className="px-4 pb-4 pt-6">
                    <div className="pb-5">
                        <div className="text-2xl">
                            Hi there, {user.username}.
                        </div>
                        <div className="text-sm">
                            <Link
                                className="underline"
                                href={'login?force=true'}
                            >
                                Not you?
                            </Link>
                        </div>
                    </div>
                    <div className="pb-2">
                        <div>An external application</div>
                        <div className="text-xl font-semibold">{clientId}</div>
                        <div>wants to access your bingo.gg account.</div>
                    </div>
                    <div className="mb-4 w-full border-b border-gray-400 pt-4" />
                    <div className="w-full px-4 pt-2 text-left">
                        <div>This will allow the application to</div>
                        <ul className="list-inside list-disc">
                            {scopeList.map((scope) => (
                                <li key={scope}>{scope}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4 w-full border-b border-gray-400 pt-4" />
                    <div className="text-sm">
                        You should only authorize this application if you
                        recognize it. If you don&#39;t recognize it, you can
                        safely close this window.
                    </div>
                </div>
                <div className="w-full rounded-b-lg bg-neutral-900 py-4">
                    <button className="rounded-md border p-2">Authorize</button>
                </div>
            </div>
        </div>
    );
}
