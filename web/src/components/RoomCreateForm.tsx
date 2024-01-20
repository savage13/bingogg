'use client';
import { Game } from '@/types/Game';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useAsync } from 'react-use';
import * as yup from 'yup';
import { useApi } from '../lib/Hooks';

const roomValidationSchema = yup.object().shape({
    name: yup.string().required('Room name is required'),
    nickname: yup.string().required('Player nickname is required'),
    game: yup.string().required('Game is required'),
    variant: yup.string().required('Game variant is required'),
    mode: yup
        .string()
        .required('Game mode is required')
        .oneOf(['lines', 'blackout', 'lockout'], 'Invalid game mode'),
});

function GenerationModeSelectField() {
    const {
        values: { game },
    } = useFormikContext<{ game: string }>();

    const modes = useAsync(async () => {
        if (!game) {
            return [];
        }

        const res = await fetch(`/api/games/${game}`);
        if (!res.ok) {
            return [];
        }
        const gameData: Game = await res.json();

        const modes = ['Random'];
        if (gameData.enableSRLv5) {
            modes.push('SRLv5');
        }
        return modes;
    }, [game]);

    if (modes.loading || modes.error || !modes.value) {
        return null;
    }

    return (
        <label className="flex items-center gap-x-2">
            Generation Mode
            <Field as="select" name="generationMode" className="rounded-md p-1">
                <option value="">Select Generation Mode</option>
                {modes.value.map((mode) => (
                    <option key={mode} value={mode}>
                        {mode}
                    </option>
                ))}
            </Field>
        </label>
    );
}

export default function RoomCreateForm() {
    const { data: games, isLoading } = useApi<Game[]>('/api/games');
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    if (!games) {
        return 'Unable to load game list';
    }

    return (
        <Formik
            initialValues={{
                name: '',
                nickname: '',
                game: '',
                variant: '',
                mode: '',
                seed: undefined,
                generationMode: '',
            }}
            validationSchema={roomValidationSchema}
            onSubmit={async (values) => {
                const res = await fetch('/api/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
                if (!res.ok) {
                    // handle the error
                    return;
                }
                const { slug, authToken } = await res.json();
                localStorage.setItem('bingogg.temp.nickname', values.nickname);
                localStorage.setItem(`authToken-${slug}`, authToken);
                router.push(`/rooms/${slug}`);
            }}
        >
            <Form className="flex flex-col gap-y-4">
                <InlineLabel label="Room Name">
                    <Field name="name" className="rounded-md" />
                </InlineLabel>
                <ErrorMessage
                    name="name"
                    component="div"
                    className="text-xs text-red-500"
                />
                <InlineLabel label="Nickname">
                    <Field name="nickname" className="rounded-md" />
                </InlineLabel>
                <ErrorMessage
                    name="nickname"
                    component="div"
                    className="text-xs text-red-500"
                />
                <InlineLabel label="Game">
                    <Field as="select" name="game" className="rounded-md p-1">
                        <option value="">Select Game</option>
                        {games.map((game) => (
                            <option key={game.slug} value={game.slug}>
                                {game.name}
                            </option>
                        ))}
                    </Field>
                </InlineLabel>
                <ErrorMessage
                    name="game"
                    component="div"
                    className="text-xs text-red-500"
                />
                <InlineLabel label="Variant">
                    <Field name="variant" className="rounded-md" />
                </InlineLabel>
                <ErrorMessage
                    name="variant"
                    component="div"
                    className="text-xs text-red-500"
                />
                <InlineLabel label="Game Mode">
                    <Field as="select" name="mode" className="rounded-md p-1">
                        <option value="">Select Game Mode</option>
                        <option value="lines">Lines</option>
                        <option value="blackout">Blackout</option>
                        <option value="lockout">Lockout</option>
                    </Field>
                </InlineLabel>
                <ErrorMessage
                    name="mode"
                    component="div"
                    className="text-xs text-red-500"
                />
                <div className="rounded-md border px-3 py-2">
                    <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full items-center justify-between gap-x-4 text-left text-sm font-medium">
                                    <span>Advanced Generation Options</span>
                                    <FontAwesomeIcon
                                        icon={
                                            open ? faChevronUp : faChevronDown
                                        }
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="flex px-4 pb-2 pt-4 text-sm text-gray-500">
                                    <label className="mr-5 flex items-center gap-x-2">
                                        Seed
                                        <Field
                                            type="number"
                                            name="seed"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            className="no-step"
                                        />
                                    </label>
                                    <GenerationModeSelectField />
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
                <div className="flex">
                    <div className="grow" />
                    <button className="rounded-md border bg-gray-600 px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-700">
                        Create Room
                    </button>
                </div>
            </Form>
        </Formik>
    );
}

interface InlineLabelProps {
    label: string;
    children: ReactNode;
}

function InlineLabel({ label, children }: InlineLabelProps) {
    return (
        <label className="flex justify-center gap-x-8 text-xl">
            <span className="w-1/2 text-right">{label}</span>
            <div className="grow text-black">{children}</div>
        </label>
    );
}
