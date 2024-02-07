'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Suspense, useCallback, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useFetch } from '../../../../../lib/Hooks';
import { OAuthClient } from '../../../../../types/OAuthClient';

function CopyButton({ value }: { value: string }) {
    const [state, copyToClipboard] = useCopyToClipboard();
    const [copied, setCopied] = useState(false);

    const copy = useCallback(() => {
        copyToClipboard(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [value, copyToClipboard, setCopied]);

    if (copied && state.error) {
        return (
            <button
                type="button"
                className="rounded-md bg-error px-2 py-1.5 hover:bg-primary-light"
            >
                Unable to copy
            </button>
        );
    }
    if (copied && state.value) {
        return (
            <button
                type="button"
                className="rounded-md bg-success px-2 py-1.5 hover:bg-green-600"
            >
                Copied
            </button>
        );
    }
    return (
        <button
            type="button"
            className="rounded-md bg-primary px-4 py-1.5 hover:bg-primary-light"
            onClick={copy}
        >
            Copy
        </button>
    );
}

function ApplicationForm({ id }: { id: string }) {
    const appData = useFetch<OAuthClient>(`/api/oauth/${id}`);

    if (!appData) {
        return 'Unable to load application data.';
    }

    return (
        <Formik
            initialValues={{
                name: appData.name,
                redirects: appData.redirectUris,
            }}
            onSubmit={async ({ name, redirects }) => {
                const res = await fetch(`/api/oauth/${id}`, {
                    method: 'POST',
                    body: JSON.stringify({ name, redirects }),
                });
                if (!res.ok) {
                    //TODO: handle error
                    return;
                }
            }}
        >
            {({ values }) => (
                <Form>
                    <div className="pb-10">
                        <h3 className="pb-2 text-xl">Basic Info</h3>
                        <label>
                            <div>App Name</div>
                            <Field name="name" className="w-1/2" />
                        </label>
                    </div>
                    <div className="pb-10">
                        <h3 className="pb-2 text-xl">Client Information</h3>
                        <div className="flex gap-x-6">
                            <div className="max-w-[50%] basis-1/2">
                                <div className="pb-1 text-lg">Client ID</div>
                                <div className="pb-2 text-xs text-text-light">
                                    Your client id is your application&#39;s
                                    public identifier, similar to your username.
                                </div>
                                <div className="pb-2">{appData.clientId}</div>
                                <CopyButton value={appData.clientId} />
                            </div>
                            <div className="max-w-[50%] basis-1/2">
                                <div className="pb-1 text-lg">
                                    Client Secret
                                </div>
                                <div className="pb-2 text-xs text-text-light">
                                    Your client secret is your application&#39;s
                                    password and must be kept secret. You can
                                    only see the secret once when it is
                                    generated.
                                </div>
                                <button className="rounded-md bg-primary px-4 py-1.5 hover:bg-primary-light">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pb-3">
                        <h3 className="pb-2 text-xl">Redirects</h3>
                        <div className="pb-2 text-sm text-text-light">
                            Specify where you want to send users after
                            authentication. At least one redirect URI is
                            required for authorization to work, and all
                            authorization requests must include a redirect URI
                            that exactly matches one of these.
                        </div>
                        <div className="pb-2">
                            <FieldArray name="redirects">
                                {({ push, remove }) => (
                                    <>
                                        {values.redirects.map(
                                            (redirect, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-x-3 pb-2"
                                                >
                                                    <Field
                                                        name={`redirects.${index}`}
                                                        className="w-1/2"
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faClose}
                                                        className="cursor-pointer text-xl hover:text-gray-300"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    />
                                                </div>
                                            ),
                                        )}
                                        <button
                                            type="button"
                                            className="rounded-md bg-primary px-4 py-1.5 hover:bg-primary-light"
                                            onClick={() => push('')}
                                        >
                                            Add
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </div>
                    </div>
                    <div>
                        <button className="float-right rounded-md bg-success px-4 py-1.5 hover:bg-green-600">
                            Save
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default function OAuthApplication({
    params: { id },
}: {
    params: { id: string };
}) {
    return (
        <div className="flex justify-center">
            <div className="max-w-[75%] rounded-md border border-border bg-foreground p-4">
                <h1 className="pb-2 text-center text-2xl">
                    Edit OAuth Application
                </h1>
                <Suspense fallback={<>Loading application data...</>}>
                    <ApplicationForm id={id} />
                </Suspense>
            </div>
        </div>
    );
}
