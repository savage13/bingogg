'use client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useApi } from '../lib/Hooks';
import { Game } from '@/types/Game';
import { ReactNode } from 'react';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

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

export default function RoomCreateForm() {
    const { data: games, isLoading } = useApi<Game[]>(
        'http://localhost:8000/api/games',
    );
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
            }}
            validationSchema={roomValidationSchema}
            onSubmit={async (values) => {
                const res = await fetch('http://localhost:8000/api/rooms', {
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
