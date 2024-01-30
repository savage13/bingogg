'use client';
import { useContext, useState } from 'react';
import { RoomContext } from '../../context/RoomContext';
import { Field, Form, Formik } from 'formik';

export default function RoomLogin() {
    // context
    const { connect, roomData } = useContext(RoomContext);

    // state
    const [error, setError] = useState<string>();

    return (
        <div className="flex justify-center">
            <div className="w-fit rounded-md border border-border bg-foreground p-4">
                <Formik
                    initialValues={{ nickname: '', password: '' }}
                    onSubmit={async ({ nickname, password }) => {
                        const result = await connect(nickname, password);
                        if (!result.success) {
                            setError(result.message);
                        }
                    }}
                >
                    <Form>
                        {error && (
                            <div className="pb-1 text-sm text-red-500">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-y-4">
                            <label>
                                <div>Nickname</div>
                                <Field
                                    id="nickname"
                                    name="nickname"
                                    className="text-black"
                                />
                            </label>
                            <label>
                                <div>Password</div>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="text-black"
                                />
                            </label>
                            <div>
                                <button
                                    type="submit"
                                    className="float-right rounded-md bg-primary px-3 py-1.5"
                                >
                                    Join Room
                                </button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}
