'use client';
import { useContext, useState } from 'react';
import { RoomContext } from '../../context/RoomContext';

export default function RoomLogin() {
    // context
    const { connect } = useContext(RoomContext);
    // state
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="flex flex-col gap-y-4">
            <label>
                Nickname
                <input
                    className="text-black"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                />
            </label>
            <label>
                Password
                <input
                    type="password"
                    className="text-black"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </label>
            <button
                type="submit"
                className="bg-gray-200 text-black"
                onClick={() => connect(nickname, password)}
            >
                Join Room
            </button>
        </div>
    );
}
