'use client';
import { useContext, useState } from 'react';
import { RoomContext } from '../../context/RoomContext';
import { Field, Form, Formik } from 'formik';

export default function RoomLogin() {
    // context
    const { connect } = useContext(RoomContext);

    // state
    const [error, setError] = useState<string>();

    return (
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
                    <div className="pb-1 text-sm text-red-500">{error}</div>
                )}
                <div className="flex flex-col gap-y-4">
                    <label>
                        Nickname
                        <Field
                            id="nickname"
                            name="nickname"
                            className="text-black"
                        />
                    </label>
                    <label>
                        Password
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            className="text-black"
                        />
                    </label>
                    <button type="submit" className="bg-gray-200 text-black">
                        Join Room
                    </button>
                </div>
            </Form>
        </Formik>
    );
}
