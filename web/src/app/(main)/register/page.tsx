'use client';
import { ErrorMessage, FastField, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import * as yup from 'yup';
import { UserContext } from '../../../context/UserContext';

const validationSchema = yup.object({
    email: yup
        .string()
        .required('Email is required.')
        .email('Not a properly formatted email.')
        .test(
            'isAvailable',
            'An account is already registered with that email.',
            async (email) => {
                const res = await fetch(
                    `/api/registration/checkEmail?email=${email}`,
                );
                if (!res.ok) {
                    return false;
                }
                const data = await res.json();
                if (data.valid) {
                    return true;
                }
                return false;
            },
        ),
    username: yup
        .string()
        .required('Username is required.')
        .min(4, 'Username must be at least 4 characters.')
        .max(16, 'Username cannot be longer than 16 characters.')
        .matches(
            /^[a-zA-Z0-9]*$/,
            'Username can only contain letters and numbers.',
        )
        .test(
            'isAvailable',
            'An account with that username already exists.',
            async (username, ctx) => {
                const res = await fetch(
                    `/api/registration/checkUsername?name=${username}`,
                );
                if (!res.ok) {
                    return ctx.createError({
                        message: 'Unable to validate username availability.',
                    });
                }
                const data = await res.json();
                if (!data.valid) {
                    if (data.reason) {
                        return ctx.createError({ message: data.reason });
                    }
                    return false;
                }
                return true;
            },
        ),
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

export default function Register() {
    const router = useRouter();
    const { user, checkSession } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            router.replace('/');
        }
    }, [user, router]);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex max-w-[50%] grow flex-col items-center rounded-3xl border-4 px-8 py-6">
                <div className="pb-1 text-3xl font-bold">
                    Register for an Account
                </div>
                <div className="pb-4 text-justify text-sm text-gray-300">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Log in instead
                    </Link>
                </div>
                <Formik
                    initialValues={{
                        email: '',
                        username: '',
                        password: '',
                        passwordConfirmation: '',
                    }}
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    onSubmit={async ({ email, username, password }) => {
                        const res = await fetch('/api/registration/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email,
                                username,
                                password,
                            }),
                        });
                        if (!res.ok) {
                            //TODO: handle errors
                            return;
                        }
                        if (res.status === 201) {
                            await checkSession();
                            router.push('/');
                        }
                    }}
                >
                    {({ isValid, isSubmitting, values: { password } }) => (
                        <Form className="flex w-full flex-col gap-y-2">
                            <div className="w-full">
                                <label>
                                    <div>Email</div>
                                    <FastField
                                        name="email"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="w-full text-xs text-red-400"
                                />
                            </div>
                            <div className="w-full">
                                <label>
                                    <div>Username</div>
                                    <FastField
                                        name="username"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="w-full text-xs text-red-400"
                                />
                            </div>
                            <div className="w-full">
                                <label>
                                    <div>Password</div>
                                    <FastField
                                        type="password"
                                        name="password"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="w-full text-xs text-red-400"
                                />
                                <div className="w-full pb-2 pl-0.5 pt-1 text-xs">
                                    Your password must contain the following:
                                    <ul className=" list-disc pl-4">
                                        <li
                                            className={
                                                password.length >= 8
                                                    ? 'text-green-400'
                                                    : ''
                                            }
                                        >
                                            At least 8 characters
                                        </li>
                                        <li
                                            className={
                                                password.match(/[a-z]+/)
                                                    ? 'text-green-400'
                                                    : ''
                                            }
                                        >
                                            One lowercase letter
                                        </li>
                                        <li
                                            className={
                                                password.match(/[A-Z]+/)
                                                    ? 'text-green-400'
                                                    : ''
                                            }
                                        >
                                            One uppercase letter
                                        </li>
                                        <li
                                            className={
                                                password.match(/[0-9]+/)
                                                    ? 'text-green-400'
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
                                                    ? 'text-green-400'
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
                                    <div>Confirm Password</div>
                                    <Field
                                        type="password"
                                        name="passwordConfirmation"
                                        className="w-full text-black"
                                    />
                                </label>
                                <ErrorMessage
                                    name="passwordConfirmation"
                                    component="div"
                                    className="w-full text-xs text-red-400"
                                />
                            </div>
                            <div className="w-full pt-4">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="float-right rounded-md border bg-black px-4 py-2 shadow-sm shadow-white hover:shadow-md disabled:bg-gray-600 disabled:hover:shadow-sm"
                                >
                                    Register
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
