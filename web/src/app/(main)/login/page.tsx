'use client';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';

export default function Login() {
    return (
        <div className="flex h-full items-center justify-center">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={function ({
                    username,
                    password,
                }: FormikValues): void | Promise<any> {}}
            >
                <Form className="flex max-w-[50%] flex-col items-center rounded-3xl border-4 px-8 py-6">
                    <div className="pb-1 text-3xl font-bold">
                        Login to bingo.gg
                    </div>
                    <div className="pb-8 text-justify text-sm text-gray-300">
                        You only need to login if you plan to manage a game. No
                        login is required to play bingo.
                    </div>
                    <label className="pb-4">
                        <span className="pr-3">Username</span>
                        <Field name="username" className="text-black" />
                    </label>
                    <label>
                        <span className="pr-3">Password</span>
                        <Field
                            type="password"
                            name="password"
                            className="text-black"
                        />
                    </label>
                    <Link href="" className="pl-4 pt-0.5 text-sm underline">
                        Forgot password?
                    </Link>
                    <div className="w-full pt-4">
                        <Link
                            href="/register"
                            className="float-left    rounded-md border px-4 py-2 shadow-sm shadow-white"
                        >
                            Register
                        </Link>
                        <button
                            type="submit"
                            className="float-right rounded-md border px-4 py-2 shadow-sm shadow-white"
                        >
                            Log In
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
