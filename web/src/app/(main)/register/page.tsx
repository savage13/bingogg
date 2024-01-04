'use client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup
        .string()
        .required('Email is required')
        .email('Not a properly formatted email'),
    username: yup
        .string()
        .required('Username is required')
        .min(4, 'Username must be at least 4 characters')
        .max(16, 'Username cannot be longer than 16 characters')
        .matches(
            /^[a-zA-Z0-9]*$/,
            'Username can only contain letters and numbers',
        ),
    password: yup
        .string()
        .required('Password is required')
        .min(8, '3')
        .matches(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+-=|]).{8,}$/,
            '4',
        ),
    passwordConfirmation: yup.string().required('Confirm your password'),
});

export default function Register() {
    return (
        <div className="flex h-full items-center justify-center">
            <Formik
                initialValues={{
                    email: '',
                    username: '',
                    password: '',
                    passwordConfirm: '',
                }}
                validationSchema={validationSchema}
                validate={({ email, username, password, passwordConfirm }) => {
                    const errors: { passwordConfirm?: string } = {};
                    if (password !== passwordConfirm) {
                        errors.passwordConfirm = 'Passwords do not match';
                    }

                    return errors;
                }}
                onSubmit={function ({ username, password }) {}}
            >
                {({ isValid, isSubmitting, values: { password } }) => (
                    <Form className="flex max-w-[50%] flex-col items-center rounded-3xl border-4 px-8 py-6">
                        <div className="pb-1 text-3xl font-bold">
                            Register for an Account
                        </div>
                        <div className="pb-4 text-justify text-sm text-gray-300">
                            Interested in managing a game? Create an account to
                            get started. Already have an account?{' '}
                            <Link href="/login" className="underline">
                                Log in instead
                            </Link>
                        </div>
                        <label className="w-full">
                            <div>Email</div>
                            <Field name="email" className="w-full text-black" />
                        </label>
                        <ErrorMessage
                            name="email"
                            component="div"
                            className="w-full text-sm text-red-500"
                        />
                        <label className="w-full">
                            <div>Username</div>
                            <Field
                                name="username"
                                className="w-full text-black"
                            />
                        </label>
                        <ErrorMessage
                            name="username"
                            component="div"
                            className="w-full text-sm text-red-500"
                        />
                        <label className="w-full">
                            <div>Password</div>
                            <Field
                                type=""
                                name="password"
                                className="w-full text-black"
                            />
                        </label>
                        <ErrorMessage
                            name="password"
                            component="div"
                            className="w-full text-sm text-red-500"
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
                                            /[*.!@#$%^&(){}\[\]:;<>,.?\/~_+-=|\\]+/,
                                        )
                                            ? 'text-green-400'
                                            : ''
                                    }
                                >
                                    A symbol
                                </li>
                            </ul>
                        </div>
                        <label className="w-full">
                            <div>Confirm Password</div>
                            <Field
                                type="password"
                                name="passwordConfirm"
                                className="w-full text-black"
                            />
                        </label>
                        <ErrorMessage
                            name="passwordConfirm"
                            component="div"
                            className="w-full text-sm text-red-500"
                        />

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
    );
}
