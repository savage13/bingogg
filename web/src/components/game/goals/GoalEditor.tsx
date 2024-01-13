import { Goal } from '@/types/Goal';
import { Field, FieldProps, Form, Formik } from 'formik';
import CreatableSelect from 'react-select/creatable';
import NumberInput from '@/components/input/NumberInput';
import { KeyedMutator, mutate } from 'swr';
interface GoalEditorProps {
    slug: string;
    goal: Goal;
    isNew?: boolean;
    cancelNew?: () => void;
    mutateGoals: KeyedMutator<Goal[]>;
    categories: { label: string; value: string }[];
    canModerate?: boolean;
}

export default function GoalEditor({
    slug,
    goal,
    isNew,
    cancelNew,
    mutateGoals,
    categories,
    canModerate,
}: GoalEditorProps) {
    return (
        <Formik
            initialValues={{
                goal: goal.goal,
                description: goal.description,
                categories: goal.categories ?? [],
                difficulty: goal.difficulty ?? 0,
            }}
            onSubmit={async ({
                goal: goalText,
                description,
                categories,
                difficulty,
            }) => {
                if (isNew) {
                    const res = await fetch(`/api/games/${slug}/goals`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            goal: goalText,
                            description,
                            categories,
                            difficulty,
                        }),
                    });
                    if (!res.ok) {
                        // TODO: handle error
                        return;
                    }
                    mutateGoals();
                    if (cancelNew) {
                        cancelNew();
                    }
                } else {
                    const res = await fetch(`/api/goals/${goal.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            goal: goalText !== goal.goal ? goalText : undefined,
                            description:
                                description !== goal.description
                                    ? description
                                    : undefined,
                            categories:
                                categories.length !== goal.categories?.length ||
                                !categories.every(
                                    (cat) => goal.categories?.includes(cat),
                                )
                                    ? categories
                                    : undefined,
                            difficulty:
                                difficulty !== goal.difficulty
                                    ? difficulty
                                    : undefined,
                        }),
                    });
                    if (!res.ok) {
                        //TODO: handle error
                        return;
                    }
                    mutateGoals();
                }
            }}
            enableReinitialize
        >
            {({ isSubmitting, isValidating, resetForm }) => (
                <Form className="flex w-full flex-col">
                    <label>
                        Goal Text
                        <Field
                            name="goal"
                            disabled={!canModerate}
                            className="w-full grow text-black"
                        />
                    </label>
                    <label className="pt-4">
                        Goal Description
                        <Field
                            name="description"
                            as="textarea"
                            disabled={!canModerate}
                            className="w-full rounded-md p-1 text-black"
                            rows={6}
                        />
                    </label>
                    <div className="flex w-full gap-x-4">
                        <label className="w-1/2">
                            Categories
                            <Field name="categories" disabled={!canModerate}>
                                {({
                                    field,
                                    form,
                                    meta,
                                }: FieldProps<string[]>) => (
                                    <CreatableSelect
                                        options={categories}
                                        name={field.name}
                                        value={field.value.map((cat) => ({
                                            value: cat,
                                            label: cat,
                                        }))}
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                field.name,
                                                option.map((val) => val.value),
                                            );
                                        }}
                                        onBlur={field.onBlur}
                                        isMulti
                                        classNames={{
                                            control: () => 'rounded-md',
                                            menuList: () => 'text-black',
                                            container: () => '',
                                        }}
                                        isDisabled={!canModerate}
                                    />
                                )}
                            </Field>
                        </label>
                        <label className="w-1/2">
                            <div>Difficulty</div>
                            <Field
                                name="difficulty"
                                disabled={!canModerate}
                                className="w-full"
                                component={NumberInput}
                                min={1}
                                max={25}
                            />
                        </label>
                    </div>
                    {canModerate && (
                        <div className="flex pt-2">
                            <button
                                type="button"
                                className="rounded-md bg-red-500 px-4 py-2 text-center text-sm font-medium text-black hover:bg-red-400"
                                onClick={() => {
                                    if (isNew && cancelNew) {
                                        cancelNew();
                                    }
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <div className="grow" />
                            <button
                                className="rounded-md bg-green-400 px-4 py-2 text-center text-sm font-medium text-black hover:bg-green-300 disabled:bg-gray-300"
                                type="submit"
                                disabled={isSubmitting || isValidating}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
}
