'use client';
import { Formik, Form, Field, ErrorMessage, FastField } from 'formik';
import { useSearchParams } from 'next/navigation';
import * as yup from 'yup';

const validationSchema = yup.object({
    password: yup
        .string()
        .required('Password is required.')
        .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+-=|]).{8,}$/,
            'Password does not meet strength requirements.',
        ),
    passwordConfirmation: yup
        .string()
        .required('Confirm your password.')
        .test(
            'matches',
            'Passwords do not match.',
            (confirm, ctx) =>
                ctx.parent.password && confirm === ctx.parent.password,
        ),
});

export default function ResetPassword() {
    const params = useSearchParams();
    const token = params.get('token');

    if (!token) {
        return null;
    }

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex max-w-[50%] grow flex-col items-center rounded-3xl border-4 border-border bg-foreground px-8 py-6 shadow-lg shadow-border/30">
                <div className="pb-1 text-3xl font-bold">Reset Password</div>
                <Formik
                    initialValues={{ password: '', passwordConfirm: '' }}
                    validationSchema={validationSchema}
                    onSubmit={async ({ password }) => {
                        const res = await fetch('/api/auth/resetPassword', {
                            method: 'POST',
                            body: JSON.stringify({ token, password }),
                        });
                        if (!res.ok) {
                            //TODO: handle error
                            return;
                        }
                    }}
                >
                    {({ isValid, isSubmitting, values: { password } }) => (
                        <Form className="flex w-full flex-col gap-y-4">
                            <div className="w-full">
                                <label>
                                    <div>New Password</div>
                                    <FastField
                                        type="password"
                                        name="password"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="mt-1 w-full text-xs text-error-content"
                                />
                                <div className="w-full pb-2 pl-0.5 pt-1 text-xs">
                                    Your password must contain the following:
                                    <ul className=" list-disc pl-4">
                                        <li
                                            className={
                                                password.length >= 8
                                                    ? 'text-success-content'
                                                    : ''
                                            }
                                        >
                                            At least 8 characters
                                        </li>
                                        <li
                                            className={
                                                password.match(/[a-z]+/)
                                                    ? 'text-success-content'
                                                    : ''
                                            }
                                        >
                                            One lowercase letter
                                        </li>
                                        <li
                                            className={
                                                password.match(/[A-Z]+/)
                                                    ? 'text-success-content'
                                                    : ''
                                            }
                                        >
                                            One uppercase letter
                                        </li>
                                        <li
                                            className={
                                                password.match(/[0-9]+/)
                                                    ? 'text-success-content'
                                                    : ''
                                            }
                                        >
                                            A number
                                        </li>
                                        <li
                                            className={
                                                password.match(
                                                    /[*.!@$%^&(){}\[\]:;<>,.?\/~_\+\-=|\\]+/,
                                                )
                                                    ? 'text-success-content'
                                                    : ''
                                            }
                                        >
                                            A symbol
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full">
                                <label>
                                    <div>Confirm New Password</div>
                                    <Field
                                        type="password"
                                        name="passwordConfirmation"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="passwordConfirmation"
                                    component="div"
                                    className="mt-1 w-full text-xs text-error-content"
                                />
                            </div>
                            <div className="w-full pt-2">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="float-right rounded-md bg-primary px-4 py-2 hover:bg-primary-light disabled:bg-gray-600"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
