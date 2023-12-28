'use client';
import { useApi } from '@/lib/Hooks';
import { Game } from '@/types/Game';
import Link from 'next/link';
import { Goal } from '@/types/Goal';
import { useState } from 'react';
import { Field, Form, Formik } from 'formik';

export default function Game({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const [newGoal, setNewGoal] = useState(false);

    const { data: gameData, isLoading } = useApi<Game>(
        `http://localhost:8000/api/games/${slug}?`,
    );
    const {
        data: goals,
        isLoading: goalsLoading,
        mutate: mutateGoals,
    } = useApi<Goal[]>(`http://localhost:8000/api/games/${slug}/goals`);

    if (!gameData || isLoading || !goals || goalsLoading) {
        return null;
    }

    return (
        <div className="flex gap-x-3">
            <div className="grow rounded-2xl border-4 p-5">
                <div className="flex gap-x-3">
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
                    <div>
                        <Link
                            className="text-sm underline"
                            href={`/games/${slug}`}
                        >
                            {gameData.slug}
                        </Link>
                        <div className="text-xl">{gameData.name}</div>
                    </div>
                </div>
                <div>
                    <div className="text-center text-2xl">Goals</div>
                    <div className="">
                        {goals.map((goal) => (
                            <div
                                key={goal.goal}
                                className="flex w-full py-2 text-center"
                            >
                                <div className="grow">{goal.goal}</div>
                                <div className="grow">{goal.description}</div>
                            </div>
                        ))}
                        {!newGoal && (
                            <div className="text-center">
                                <div
                                    className="cursor-pointer"
                                    role="button"
                                    onClick={() => {
                                        setNewGoal(true);
                                    }}
                                >
                                    New Goal
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {newGoal && (
                    <Formik
                        initialValues={{ goal: '', description: '' }}
                        onSubmit={async ({ goal, description }) => {
                            if (!goal) {
                                return;
                            }
                            const res = await fetch(
                                `http://localhost:8000/api/games/${slug}/goals`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        goal,
                                        description,
                                    }),
                                },
                            );
                            if (!res.ok) {
                                // handle error
                                return;
                            }
                            mutateGoals();
                            // setNewGoal(false);
                        }}
                    >
                        <Form className="flex justify-center gap-x-3">
                            <label>
                                Goal Text
                                <Field
                                    name="goal"
                                    className="ml-2 text-black"
                                />
                            </label>
                            <label>
                                Goal Description
                                <Field
                                    name="description"
                                    className="ml-2 text-black"
                                />
                            </label>
                            <button
                                className="inline-flex justify-center rounded-md border border-transparent bg-green-400 px-4 py-2 text-sm font-medium text-black hover:bg-green-300 disabled:bg-gray-300"
                                type="submit"
                                // disabled={isSubmitting || isValidating}
                            >
                                Save
                            </button>
                            <button
                                className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-black hover:bg-red-400"
                                onClick={() => setNewGoal(false)}
                            >
                                Cancel
                            </button>
                        </Form>
                    </Formik>
                )}
            </div>
            <div className="w-1/4 rounded-2xl border-4 p-5"></div>
        </div>
    );
}
