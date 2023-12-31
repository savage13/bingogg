import { Goal } from '@/types/Goal';
import { Field, FieldProps, Form, Formik } from 'formik';
import CreatableSelect from 'react-select/creatable';
import NumberInput from '@/components/input/NumberInput';

const categories: { label: string; value: string }[] = [];

interface GoalEditorProps {
    slug: string;
    goal: Goal;
    isNew?: boolean;
    cancelNew?: () => void;
}

export default function GoalEditor({
    slug,
    goal,
    isNew,
    cancelNew,
}: GoalEditorProps) {
    return (
        <Formik
            initialValues={{
                goal: goal.goal,
                description: goal.description,
                categories: [] as {
                    label: string;
                    value: string;
                }[],
                difficulty: 1,
            }}
            onSubmit={async ({ goal, description, categories, difficulty }) => {
                if (isNew) {
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
                } else {
                    // TODO: submit edit request
                }
            }}
            enableReinitialize
        >
            {({ isSubmitting, isValidating, resetForm }) => (
                <Form className="flex w-full flex-col">
                    <label>
                        Goal Text
                        <Field name="goal" className="w-full grow text-black" />
                    </label>
                    <label className="pt-4">
                        Goal Description
                        <Field
                            name="description"
                            as="textarea"
                            className="w-full rounded-md p-1 text-black"
                            rows={6}
                        />
                    </label>
                    <div className="flex w-full gap-x-4">
                        <label className="w-1/2">
                            Categories
                            <Field name="categories">
                                {({
                                    field,
                                    form,
                                    meta,
                                }: FieldProps<
                                    {
                                        label: string;
                                        value: string;
                                    }[]
                                >) => (
                                    <CreatableSelect
                                        options={categories}
                                        name={field.name}
                                        value={field.value}
                                        onChange={(option, meta) => {
                                            if (
                                                meta.action === 'create-option'
                                            ) {
                                                categories.push(meta.option);
                                            }
                                            form.setFieldValue(
                                                field.name,
                                                option,
                                            );
                                        }}
                                        onBlur={field.onBlur}
                                        isMulti
                                        classNames={{
                                            control: () => 'rounded-md',
                                            menuList: () => 'text-black',
                                            container: () => '',
                                        }}
                                    />
                                )}
                            </Field>
                        </label>
                        <label className="w-1/2">
                            <div>Difficulty</div>
                            <Field
                                name="difficulty"
                                className="w-full"
                                component={NumberInput}
                                min={1}
                                max={25}
                            />
                        </label>
                    </div>
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
                </Form>
            )}
        </Formik>
    );
}
