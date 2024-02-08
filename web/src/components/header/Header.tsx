'use client';
import { useContext, useState } from 'react';
import HeaderLink from './HeaderLink';
import { UserContext } from '../../context/UserContext';
import {
    autoUpdate,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
    useTransitionStyles,
} from '@floating-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function Header() {
    const { user, loggedIn, logout } = useContext(UserContext);

    const [menuOpen, setMenuOpen] = useState(false);

    const { refs, context, floatingStyles } = useFloating({
        whileElementsMounted: autoUpdate,
        open: menuOpen,
        onOpenChange: setMenuOpen,
        middleware: [shift({ padding: 5 })],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'menu' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

    const { isMounted, styles } = useTransitionStyles(context, {
        initial: {
            transform: 'scale(0)',
        },
    });

    return (
        <div className="flex items-center gap-x-4 rounded-b-lg bg-primary px-4 py-2 text-white">
            <HeaderLink href="/" className="text-xl">
                bingo.gg
            </HeaderLink>
            <div className="grow" />
            <HeaderLink href="/games">Games</HeaderLink>
            <HeaderLink href="/rooms">Play</HeaderLink>
            {!loggedIn && <HeaderLink href="/login">Log In</HeaderLink>}
            {loggedIn && user && (
                <>
                    <div
                        className="flex items-center"
                        role="button"
                        ref={refs.setReference}
                        {...getReferenceProps()}
                    >
                        <HeaderLink href="">{user.username}</HeaderLink>
                    </div>
                    {isMounted && (
                        <div
                            ref={refs.setFloating}
                            className="absolute flex flex-col rounded-lg border border-slate-200 bg-white py-2 shadow-xl"
                            style={floatingStyles}
                            {...getFloatingProps}
                        >
                            <div style={styles}>
                                {/* {userMenu.map((item) => (
                                    <UserMenuItem
                                        key={item.label}
                                        label={item.label}
                                        to={item.to}
                                        icon={item.icon}
                                        isAction={item.isAction}
                                        isDivider={item.isDivider}
                                    />
                                ))} */}
                                {user.developer && (
                                    <Link
                                        href="/developers/oauth"
                                        className="flex w-full items-center gap-x-2 px-3 py-1 text-black hover:bg-slate-500 hover:bg-opacity-10"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCode}
                                            className="w-1/6"
                                        />
                                        Developer Portal
                                    </Link>
                                )}
                                <div
                                    role="button"
                                    className="flex w-full items-center gap-x-2 px-3 py-1 text-black hover:bg-slate-500 hover:bg-opacity-10"
                                    onClick={() => logout()}
                                >
                                    <FontAwesomeIcon
                                        icon={faRightFromBracket}
                                        className="w-1/6"
                                    />
                                    Log Out
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
