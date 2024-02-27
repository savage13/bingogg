'use client';
import {
    faDiscord,
    faGithub,
    faPatreon,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { ReactNode } from 'react';
import CookieConsent from 'react-cookie-consent';
import { ToastContainer } from 'react-toastify';
import Header from '../../components/header/Header';
import 'react-toastify/dist/ReactToastify.css';

const icons: { icon: IconDefinition; url: string }[] = [
    { icon: faGithub, url: 'https://github.com/cjs8487/bingogg' },
    { icon: faPatreon, url: 'https://www.patreon.com/Bingothon' },
    { icon: faTwitter, url: 'https://twitter.com/bingothon' },
    { icon: faDiscord, url: 'https://discord.bingothon.com' },
];

export default function CoreLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen bg-background text-text">
            <Header />
            <CookieConsent
                location="bottom"
                buttonText="I understand"
                buttonStyle={{
                    background: '#8c091b',
                    color: '#fbfbfb',
                    fontSize: '13px',
                }}
            >
                This website uses cookies to provide some parts of it&#39;s
                functionality.
            </CookieConsent>
            <div className="h-[calc(100%-60px)] p-4">{children}</div>
            <div className="bg-background">
                <div className="flex items-end rounded-t-md bg-primary-light p-2">
                    <div className="grow">
                        <div className="mb-2 flex items-center gap-x-1 text-xl">
                            {icons.map(({ icon, url }) => (
                                <a key={icon.iconName} href={url}>
                                    <FontAwesomeIcon
                                        icon={icon}
                                        className="fa-fw aspect-square rounded-full px-1 py-1.5 hover:bg-primary-content hover:bg-opacity-40"
                                    />
                                </a>
                            ))}
                        </div>
                        <div className="text-xs">
                            <div></div>© Copyright 2024 - 2024 Bingothon | All
                            Rights Reserved |{' '}
                            <Link href="/legal/privacy" className="underline">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    <div className="pr-1 text-xs">
                        bingo.gg v{process.env.version}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
