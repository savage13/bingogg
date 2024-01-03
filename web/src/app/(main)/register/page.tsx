'use client';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';

export default function Register() {
    return (
        <div className="flex h-full items-center justify-center">
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={function ({ username, password }) {}}
            >
                <Form className="flex max-w-[50%] flex-col items-center rounded-3xl border-4 px-8 py-6">
                    <div className="pb-1 text-3xl font-bold">
                        Register for an Account
                    </div>
                    <div className="pb-8 text-justify text-sm text-gray-300">
                        Interested in managing a game? Create an account to get
                        started. Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Log in instead
                        </Link>
                    </div>
                    <label className="w-full">
                        <div>Email</div>
                        <Field name="username" className="w-full text-black" />
                    </label>
                    <label className="w-full">
                        <div>Username</div>
                        <Field name="username" className="w-full text-black" />
                    </label>
                    <label className="w-full">
                        <div>Password</div>
                        <Field
                            type="password"
                            name="password"
                            className="w-full text-black"
                        />
                    </label>
                    <div className="w-full pb-2 pl-0.5 pt-1 text-xs">
                        Your password must contain the following:
                        <ul className=" list-disc pl-4">
                            <li>At least 8 characters</li>
                            <li>One lowercase letter</li>
                            <li>One uppercase letter</li>
                            <li>A number</li>
                            <li>A symbol</li>
                        </ul>
                    </div>
                    <label className="w-full">
                        <div>Confirm Password</div>
                        <Field
                            type="password"
                            name="password"
                            className="w-full text-black"
                        />
                    </label>

                    <div className="w-full pt-4">
                        <button
                            type="submit"
                            className="float-right rounded-md border px-4 py-2 shadow-sm shadow-white"
                        >
                            Register
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
