'use client';
import {
    Fragment,
    Suspense,
    use,
    useContext,
    useLayoutEffect,
    useState,
} from 'react';
import { OAuthClient } from '@/types/OAuthClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Transition, Dialog } from '@headlessui/react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../../../context/UserContext';
import Link from 'next/link';

async function getApplications(): Promise<OAuthClient[]> {
    const url = process.env.API_PATH
        ? `${process.env.API_PATH}/api/oauth/clients`
        : `/api/oauth/clients`;
    const res = await fetch(url);
    if (!res.ok) {
        //TODO: handle error
        return [];
    }
    return res.json();
}

function ApplicationsList() {
    const applications = use(getApplications());
    return (
        <div className="flex flex-col gap-y-4">
            {applications.length > 0 &&
                applications.map((app) => (
                    <Link
                        href={`/developers/oauth/${app.id}`}
                        key={app.id}
                        className="block rounded-md border p-3"
                    >
                        <div className="pb-1">{app.name}</div>
                        <div className="text-xs">{app.clientId}</div>
                    </Link>
                ))}
            {applications.length === 0 && (
                <div className="text-sm italic">
                    You have no OAuth Applications.
                </div>
            )}
        </div>
    );
}

export default function OAuth() {
    const { loggedIn, current } = useContext(UserContext);

    const [newDialogOpen, setNewDialogOpen] = useState(false);

    const router = useRouter();

    useLayoutEffect(() => {
        if (current && !loggedIn) {
            router.push('/');
        }
    });

    return (
        <>
            <div className="flex justify-center">
                <div className="w-fit rounded-md border border-border bg-foreground p-4">
                    <h2 className="pb-3 text-2xl">OAuth Applications</h2>
                    <div>
                        <Suspense fallback={<>Loading your applications...</>}>
                            <ApplicationsList />
                        </Suspense>
                    </div>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="absolute bottom-0 right-0 mb-4 mr-4 cursor-pointer rounded-full border border-border bg-primary px-4 py-3.5 text-3xl hover:bg-primary-light"
                        onClick={() => setNewDialogOpen(true)}
                    />
                </div>
            </div>
            <Transition appear show={newDialogOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setNewDialogOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-left align-middle text-text shadow-lg shadow-border/10 transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-medium leading-6"
                                    >
                                        Create new Application
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <Formik
                                            initialValues={{ name: '' }}
                                            onSubmit={async ({ name }) => {
                                                const res = await fetch(
                                                    '/api/oauth/client',
                                                    {
                                                        method: 'POST',
                                                        body: JSON.stringify({
                                                            name,
                                                        }),
                                                    },
                                                );
                                                if (!res.ok) {
                                                    //TODO: handle error
                                                    return;
                                                }
                                                const app = await res.json();
                                                router.push(
                                                    `/developers/oauth/${app.id}`,
                                                );
                                            }}
                                        >
                                            <Form>
                                                <div>
                                                    <label>
                                                        <div>Name</div>
                                                        <Field
                                                            name="name"
                                                            className="w-full"
                                                        />
                                                    </label>
                                                </div>
                                            </Form>
                                        </Formik>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            className="rounded-md border border-transparent bg-error px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                                            onClick={() =>
                                                setNewDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="float-right rounded-md border border-transparent bg-success px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
