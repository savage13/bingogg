'use client';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useState } from 'react';
import { useApi } from '../lib/Hooks';
import { User } from '../types/User';

interface UserSearchProps {
    isOpen: boolean;
    close: () => void;
    submit: (selectedUsers: string[]) => void;
    listPath?: string;
}

export default function UserSearch({
    isOpen,
    close,
    submit,
    listPath,
}: UserSearchProps) {
    const {
        data: users,
        isLoading,
        error,
    } = useApi<User[]>(listPath ?? '/api/users');

    const [selected, setSelected] = useState<string[]>([]);

    const cancel = useCallback(() => {
        setSelected([]);
        close();
    }, [close]);

    const onSubmit = useCallback(() => {
        submit(selected);
        setSelected([]);
        close();
    }, [submit, selected, close]);

    if (!users || isLoading) {
        return null;
    }

    if (error) {
        // TODO: do something to alert the user of the error
        return null;
    }

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
                                    User Search
                                </Dialog.Title>
                                <div className="mt-4 h-96 overflow-scroll">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="border-b py-2 last:border-none"
                                        >
                                            <div
                                                className="cursor-pointer select-none rounded-md px-1 py-2 hover:bg-gray-400 hover:bg-opacity-60"
                                                onClick={() => {
                                                    if (
                                                        selected.includes(
                                                            user.id,
                                                        )
                                                    ) {
                                                        setSelected(
                                                            selected.filter(
                                                                (u) =>
                                                                    u !==
                                                                    user.id,
                                                            ),
                                                        );
                                                    } else {
                                                        setSelected([
                                                            ...selected,
                                                            user.id,
                                                        ]);
                                                    }
                                                }}
                                            >
                                                {selected.includes(user.id) && (
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                        className="mr-2 text-green-500"
                                                    />
                                                )}
                                                {user.username}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5">
                                    <button
                                        type="button"
                                        className="rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400"
                                        onClick={cancel}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="float-right rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                                        onClick={onSubmit}
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
    );
}
