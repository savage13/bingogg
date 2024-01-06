'use client';
import { useContext } from 'react';
import HeaderLink from './HeaderLink';
import { UserContext } from '../../context/UserContext';

export default function Header() {
    const { user, loggedIn } = useContext(UserContext);

    return (
        <div className="flex items-center gap-x-4 bg-red-800 px-4 py-2">
            <HeaderLink href="/" className="text-xl">
                bingo.gg
            </HeaderLink>
            <div className="grow" />
            <HeaderLink href="/games">Games</HeaderLink>
            <HeaderLink href="/rooms">Play</HeaderLink>
            {!loggedIn && <HeaderLink href="/login">Log In</HeaderLink>}
            {loggedIn && <div>{user?.username}</div>}
        </div>
    );
}
