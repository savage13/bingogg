import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback, useContext, useState } from 'react';
import { RoomContext } from '../../context/RoomContext';

export default function RoomInfo() {
    const { roomData, regenerateCard } = useContext(RoomContext);

    const [showControlModal, setShowControlModal] = useState(false);

    const close = useCallback(() => {
        setShowControlModal(false);
    }, []);

    if (!roomData) {
        return (
            <div className="rounded-md border border-white p-2 text-center">
                No Room Data found.
            </div>
        );
    }

    return (
        <>
            <div
                className="cursor-pointer rounded-md border border-white px-4 py-2 text-center"
                onClick={() => {
                    setShowControlModal(true);
                }}
            >
                <div className="text-3xl font-semibold">{roomData.name}</div>
                <div className="text-lg">{roomData.game}</div>
                <div className="pb-4 text-sm">{roomData.slug}</div>
                <div className="flex text-sm">
                    <div>Variant</div>
                    <div className="grow" />
                    <div>Mode</div>
                </div>
            </div>
            <Transition appear show={showControlModal} as={Fragment}>
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
                                        Room Controls
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <div>
                                            <div className="pb-1 text-lg font-semibold">
                                                Card Controls
                                            </div>
                                            <button
                                                className="rounded-md border p-2"
                                                onClick={() => {
                                                    regenerateCard();
                                                    close();
                                                }}
                                            >
                                                Regenerate Card
                                            </button>
                                        </div>
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
