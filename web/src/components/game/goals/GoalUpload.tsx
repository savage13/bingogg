import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { Field, Form, Formik } from 'formik';
import { Fragment } from 'react';
import PermissionsManagement from '../PermissionsManagement';
import GoalManagement from './GoalManagement';

interface GoalUploadProps {
    isOpen: boolean;
    close: () => void;
    slug: string;
}

const uploadModes = ['SRLv5'];

export default function GoalUpload({ isOpen, close, slug }: GoalUploadProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={close}>
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle text-white shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-medium leading-6"
                                >
                                    Upload Goals
                                </Dialog.Title>
                                <Tab.Group>
                                    <Tab.List className="mt-3 flex rounded-xl bg-blue-900/20 p-1">
                                        {uploadModes.map((tab) => (
                                            <Tab
                                                key={tab}
                                                className={({ selected }) =>
                                                    `w-full rounded-lg  py-2.5 text-sm font-medium leading-5 ${
                                                        selected
                                                            ? 'cursor-default bg-gray-500 shadow'
                                                            : 'bg-slate-700 text-blue-100 hover:bg-slate-600 hover:text-white'
                                                    }`
                                                }
                                            >
                                                {tab}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                    <Tab.Panels className="mt-2 h-full">
                                        <Tab.Panel className="h-full rounded-xl p-3">
                                            <Formik
                                                initialValues={{ data: '' }}
                                                onSubmit={async ({ data }) => {
                                                    const res = await fetch(
                                                        '/api/goals/upload/srlv5',
                                                        {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type':
                                                                    'application/json',
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    slug,
                                                                    input: data,
                                                                },
                                                            ),
                                                        },
                                                    );
                                                    if (!res.ok) {
                                                        //TODO: handle error
                                                        return;
                                                    }
                                                    close();
                                                }}
                                            >
                                                <Form>
                                                    <label>
                                                        Data
                                                        <Field
                                                            name="data"
                                                            as="textarea"
                                                            className="h-full w-full p-2 text-black"
                                                            rows={10}
                                                        />
                                                    </label>
                                                    <div className="mt-5">
                                                        <button
                                                            type="button"
                                                            className="rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
                                                            onClick={close}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="float-right rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </Form>
                                            </Formik>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
