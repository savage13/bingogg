'use client';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup
        .string()
        .required('Email is required.')
        .email('Not a properly formatted email.'),
    username: yup.string().required('Username is required'),
});

export default function ForgotPassword() {
    const [success, setSuccess] = useState(false);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex max-w-[50%] grow flex-col items-center rounded-3xl border-4 border-border bg-foreground px-8 py-6 shadow-lg shadow-border/30">
                <div className="pb-1 text-3xl font-bold">Forgot Password</div>
                <div className="pb-4 text-justify text-sm text-gray-300">
                    Forgot your password? Follow the steps below to reset it.
                </div>
                {!success && (
                    <Formik
                        initialValues={{ email: '', username: '' }}
                        onSubmit={async ({ email, username }) => {
                            const res = await fetch(
                                '/api/auth/forgotPassword',
                                {
                                    method: 'POST',
                                    body: JSON.stringify({ email, username }),
                                },
                            );
                            if (!res.ok) {
                                //TODO: handle error
                                return;
                            }
                            setSuccess(true);
                        }}
                    >
                        {({ isValid, isSubmitting }) => (
                            <Form className="flex w-full flex-col gap-y-4">
                                <div className="w-full">
                                    <label>
                                        <div>Email</div>
                                        <Field
                                            name="email"
                                            className="w-full text-black"
                                        />
                                    </label>
                                </div>
                                <div className="w-full">
                                    <label>
                                        <div>Username</div>
                                        <Field
                                            name="username"
                                            className="w-full text-black"
                                        />
                                    </label>
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
                )}
                {success && (
                    <div>
                        We&#39;ve sent you an email with further details on
                        resetting your password. If you don&#39;t receive it
                        soon, be sure to check your spam folder.
                    </div>
                )}
            </div>
        </div>
    );
}
