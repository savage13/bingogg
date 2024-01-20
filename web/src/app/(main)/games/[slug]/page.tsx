'use client';
import { useApi } from '@/lib/Hooks';
import { Game } from '@/types/Game';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useLayoutEffect, useState } from 'react';
import { mutate } from 'swr';
import HoverIcon from '../../../../components/HoverIcon';
import PermissionsManagement from '../../../../components/game/PermissionsManagement';
import GoalManagement from '../../../../components/game/goals/GoalManagement';
import Toggle from '../../../../components/input/Toggle';

export default function Game({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const { data: gameData, isLoading } = useApi<Game>(`/api/games/${slug}`);

    const [isOwner, setIsOwner] = useState(false);
    const [canModerate, setCanModerate] = useState(false);

    const [enabled, setEnabled] = useState(false);

    useLayoutEffect(() => {
        async function loadPermissions() {
            const res = await fetch(`/api/games/${slug}/permissions`);
            if (!res.ok) {
                //TODO: handle error
                return;
            }
            const permissions = await res.json();
            setIsOwner(permissions.isOwner);
            setCanModerate(permissions.canModerate);
        }
        loadPermissions();
    }, [slug]);

    if (!gameData || isLoading) {
        return null;
    }

    const tabs = ['Goals'];
    if (isOwner) {
        tabs.push('Permissions');
        tabs.push('Settings');
    }

    return (
        <div className="flex h-full gap-x-3">
            <div className="flex grow flex-col rounded-2xl border-4 p-5">
                <div className="flex">
                    <div className="mr-4">
                        {gameData.coverImage && (
                            <div
                                className="h-32 w-20 bg-cover bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(${gameData.coverImage})`,
                                }}
                            />
                        )}
                        {!gameData.coverImage && (
                            <div className="relative flex h-32 w-20 border shadow-[inset_0_0_12px_white]">
                                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                                    {slug}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="grow">
                        <Link
                            className="text-sm underline"
                            href={`/games/${slug}`}
                        >
                            {gameData.slug}
                        </Link>
                        <div className="text-xl">{gameData.name}</div>
                    </div>
                    <div className="w-2/5">
                        <div>
                            <div className="text-lg underline">Owners</div>
                            <div className="">
                                {gameData.owners
                                    ?.map((o) => o.username)
                                    .join(', ')}
                            </div>
                        </div>
                        <div>
                            <div className="text-lg underline">Moderators</div>
                            <div className="text-sm">
                                {gameData.moderators
                                    ?.map((o) => o.username)
                                    .join(', ')}
                            </div>
                        </div>
                    </div>
                </div>
                <Tab.Group>
                    <Tab.List className="mt-3 flex rounded-xl bg-blue-900/20 p-1">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab}
                                className={({ selected }) =>
                                    `w-full rounded-lg  py-2.5 text-sm font-medium leading-5 ${
                                        selected
                                            ? 'cursor-default bg-gray-500 shadow'
                                            : 'bg-slate-800 text-blue-100 hover:bg-slate-700 hover:text-white'
                                    }`
                                }
                            >
                                {tab}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className="mt-2 h-full">
                        <Tab.Panel className="h-full rounded-xl p-3">
                            <GoalManagement
                                slug={slug}
                                canModerate={canModerate}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <PermissionsManagement
                                slug={slug}
                                gameData={gameData}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <div>
                                <div className="text-center text-2xl">
                                    Game Settings
                                </div>
                                <Formik
                                    initialValues={{
                                        name: gameData.name,
                                        coverImage: gameData.coverImage,
                                        enableSRLv5: gameData.enableSRLv5,
                                    }}
                                    onSubmit={async ({
                                        name,
                                        coverImage,
                                        enableSRLv5,
                                    }) => {
                                        const res = await fetch(
                                            `/api/games/${slug}`,
                                            {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    name,
                                                    coverImage,
                                                    enableSRLv5,
                                                }),
                                            },
                                        );
                                        if (!res.ok) {
                                            //TODO: do something with the error
                                            return;
                                        }
                                        mutate(`/api/games/${slug}`);
                                    }}
                                >
                                    <Form className="flex w-full flex-col justify-center gap-y-3 pt-3">
                                        <div className="w-1/2">
                                            <label className="flex gap-x-4">
                                                <span className="w-1/3">
                                                    Game Name
                                                </span>
                                                <Field
                                                    name="name"
                                                    className="w-full text-black"
                                                />
                                            </label>
                                        </div>
                                        <div className="w-1/2">
                                            <label className="flex gap-x-4">
                                                <span className="w-1/3">
                                                    Cover Image
                                                </span>
                                                <Field
                                                    name="coverImage"
                                                    className="w-full text-black"
                                                />
                                            </label>
                                        </div>
                                        <label className="flex items-center gap-x-3">
                                            <Field
                                                name="enableSRLv5"
                                                component={Toggle}
                                            />
                                            <span className="flex items-center gap-x-1">
                                                Enable SRLv5 Board Generation{' '}
                                                <HoverIcon icon={faInfo}>
                                                    SRLv5 generation requires
                                                    goals to have a difficulty
                                                    value assigned to them in
                                                    order to be used in
                                                    generation. The generator
                                                    uses the difficulty value to
                                                    balance each row, column,
                                                    and diagonal, by having the
                                                    difficulty of goals in each
                                                    sum to the same value. It
                                                    also tries to minimize
                                                    synergy between goals in the
                                                    same line by minimizing the
                                                    category overlap.
                                                </HoverIcon>
                                            </span>
                                        </label>
                                        <div className="pt-3">
                                            <button
                                                type="submit"
                                                className="float-right rounded-md bg-green-400 px-4 py-2 text-center text-sm font-medium text-black hover:bg-green-300 disabled:bg-gray-300"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="w-1/4 rounded-2xl border-4 p-5"></div>
        </div>
    );
}
