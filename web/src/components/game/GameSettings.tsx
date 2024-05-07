import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { mutate } from 'swr';
import { alertError } from '../../lib/Utils';
import HoverIcon from '../HoverIcon';
import Toggle from '../input/Toggle';
import { Game } from '../../types/Game';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';

async function validateRacetimeCategory(value: string) {
    if (value) {
        const res = await fetch(`http://localhost:8000/${value}/data`);
        if (!res.ok) {
            return 'Invalid slug';
        }
    }
}

function RacetimeSettings() {
    const {
        values: { racetimeCategory },
    } = useFormikContext<{ racetimeCategory: string }>();

    const goals = useAsync(async () => {
        const res = await fetch(
            `http://localhost:8000/${racetimeCategory}/data`,
        );
        if (res.ok) {
            const data = await res.json();
            return data.goals as string[];
        }
        return [];
    }, [racetimeCategory]);

    return (
        <>
            <div className="w-1/2 ">
                <label className="flex items-center gap-x-2">
                    <div>
                        Racetime Category Slug
                        <HoverIcon icon={faInfo}>
                            This is the short name that appears in racetime URLs
                            pointing to category resources, such as race rooms.
                        </HoverIcon>
                    </div>
                    <Field
                        name="racetimeCategory"
                        className="grow"
                        validate={validateRacetimeCategory}
                    />
                </label>
                <ErrorMessage
                    name="racetimeCategory"
                    component="div"
                    className="mt-1 w-full text-xs text-error-content"
                />
            </div>
            <div className="w-1/2 ">
                <label className="flex items-center gap-x-2">
                    <span className="w-1/3">Racetime Goal</span>
                    <Field as="select" name="racetimeGoal" className="w-full">
                        {goals.value?.map((goal) => (
                            <option key={goal} value={goal}>
                                {goal}
                            </option>
                        ))}
                    </Field>
                </label>
            </div>
        </>
    );
}

interface GameSettingsProps {
    gameData: Game;
}

export default function GameSettings({ gameData }: GameSettingsProps) {
    return (
        <div>
            <div className="text-center text-2xl">Game Settings</div>
            <Formik
                initialValues={{
                    name: gameData.name,
                    coverImage: gameData.coverImage,
                    enableSRLv5: gameData.enableSRLv5,
                    racetimeCategory: '',
                    racetimeGoal: '',
                }}
                onSubmit={async ({
                    name,
                    coverImage,
                    enableSRLv5,
                    racetimeCategory,
                    racetimeGoal,
                }) => {
                    const res = await fetch(`/api/games/${gameData.slug}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            name,
                            coverImage,
                            enableSRLv5,
                            racetimeCategory,
                            racetimeGoal,
                        }),
                    });
                    if (!res.ok) {
                        const error = await res.text();
                        alertError(`Failed to update game - ${error}`);
                        return;
                    }
                    mutate(`/api/games/${gameData.slug}`);
                }}
            >
                <Form className="flex w-full flex-col justify-center gap-y-3 pt-3">
                    <div className="w-1/2">
                        <label className="flex gap-x-4">
                            <span className="w-1/3">Game Name</span>
                            <Field name="name" className="w-full text-black" />
                        </label>
                    </div>
                    <div className="w-1/2">
                        <label className="flex gap-x-4">
                            <span className="w-1/3">Cover Image</span>
                            <Field
                                name="coverImage"
                                className="w-full text-black"
                            />
                        </label>
                    </div>
                    <label className="flex items-center gap-x-3">
                        <Field name="enableSRLv5" component={Toggle} />
                        <span className="flex items-center gap-x-1">
                            Enable SRLv5 Board Generation
                            <HoverIcon icon={faInfo}>
                                SRLv5 generation requires goals to have a
                                difficulty value assigned to them in order to be
                                used in generation. The generator uses the
                                difficulty value to balance each row, column,
                                and diagonal, by having the difficulty of goals
                                in each sum to the same value. It also tries to
                                minimize synergy between goals in the same line
                                by minimizing the category overlap.
                            </HoverIcon>
                        </span>
                    </label>
                    <RacetimeSettings />
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
    );
}
