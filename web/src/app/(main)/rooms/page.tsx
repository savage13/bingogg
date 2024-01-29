'use client';
import Link from 'next/link';
import { useApi } from '../../../lib/Hooks';
import { RoomData } from '../../../types/RoomData';
import { Toggle } from '../../../components/input/Toggle';
import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronUp,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { Transition, Dialog, Disclosure } from '@headlessui/react';
import { Formik, Form, Field } from 'formik';
import RoomCreateForm from '../../../components/RoomCreateForm';

export default function Rooms() {
    const [includeInactive, setIncludeInactive] = useState(false);
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);

    const {
        data: roomList,
        isLoading,
        error,
    } = useApi<RoomData[]>(
        `/api/rooms${includeInactive ? '?inactive=true' : ''}`,
    );

    if (isLoading || !roomList) {
        return null;
    }
    if (error) {
        return 'Unable to load room list.';
    }

    return (
        <div>
            <div className="flex border-b border-border px-4 pb-4">
                <div>{roomList.length} rooms loaded.</div>
                <div className="grow" />
                <label className="flex items-center gap-x-2">
                    <span>Include Closed Rooms</span>
                    <Toggle
                        value={includeInactive}
                        setValue={setIncludeInactive}
                    />
                </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-8">
                {roomList.map((room) => (
                    <div key={room.slug}>
                        <Link href={`/rooms/${room.slug}`}>
                            <div className="w-80 rounded-md border border-border bg-foreground px-4 py-2 text-center shadow-lg shadow-border/25">
                                <div className="text-2xl font-semibold">
                                    {room.name}
                                </div>
                                <div className="pb-2 text-sm">{room.slug}</div>
                                <div className="pb-2 text-lg">{room.game}</div>
                                <div className="flex text-sm">
                                    <div>Variant</div>
                                    <div className="grow" />
                                    <div>Mode</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <FontAwesomeIcon
                icon={faPlus}
                className="absolute bottom-0 right-0 mb-4 mr-4 cursor-pointer rounded-full border border-border bg-primary px-4 py-3.5 text-3xl hover:bg-primary-light"
                onClick={() => setShowNewRoomModal(true)}
            />
            <Transition appear show={showNewRoomModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setShowNewRoomModal(false)}
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-border bg-foreground p-6 text-left align-middle text-white shadow-lg shadow-border/10 transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-medium leading-6"
                                    >
                                        Create a Room
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <RoomCreateForm />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
