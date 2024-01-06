'use client';
import { useApi } from '@/lib/Hooks';
import { Game } from '@/types/Game';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import GoalManagement from '../../../../components/game/goals/GoalManagement';

export default function Game({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const [newGoal, setNewGoal] = useState(false);

    const { data: gameData, isLoading } = useApi<Game>(`/api/games/${slug}?`);

    if (!gameData || isLoading) {
        return null;
    }

    return (
        <div className="flex h-full gap-x-3">
            <div className="flex grow flex-col rounded-2xl border-4 p-5">
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
                <GoalManagement slug={slug} />
                {newGoal && (
                    <Formik
                        initialValues={{
                            goal: '',
                            description: '',
                            categories: [],
                        }}
                        onSubmit={async ({ goal, description }) => {
                            if (!goal) {
                                return;
                            }

                            // mutateGoals();
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
