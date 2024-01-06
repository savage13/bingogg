'use client';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState('');
    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex max-w-[50%] grow flex-col items-center rounded-3xl border-4 px-8 py-6">
                <div className="pb-1 text-3xl font-bold">Login to bingo.gg</div>
                <div className="pb-5 text-justify text-sm text-gray-300">
                    No login is required to play bingo.
                </div>
                {error && <div className="text-sm text-red-400">{error}</div>}
                <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={async ({ username, password }) => {
                        const res = await fetch('/api/auth/login', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username, password }),
                        });
                        if (!res.ok) {
                            if (res.status === 403) {
                                setError('Incorrect username or password.');
                            } else {
                                setError(
                                    'An error occurred while processing your request.',
                                );
                            }
                            return;
                        }
                        router.push('/');
                    }}
                >
                    <Form className="flex w-full flex-col items-center justify-center gap-y-3">
                        <label className="w-3/4">
                            <div>Username</div>
                            <Field
                                name="username"
                                className="w-full text-black"
                            />
                        </label>
                        <div className="w-3/4">
                            <label>
                                <div className="">Password</div>
                                <Field
                                    type="password"
                                    name="password"
                                    className="w-full text-black"
                                />
                            </label>
                            <Link href="" className="pt-0.5 text-sm underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="w-full pt-1">
                            <Link
                                href="/register"
                                className="float-left rounded-md border px-4 py-2 shadow-sm shadow-white hover:bg-gray-800"
                            >
                                Register
                            </Link>
                            <button
                                type="submit"
                                className="float-right rounded-md border px-4 py-2 shadow-sm shadow-white hover:bg-gray-800"
                            >
                                Log In
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
