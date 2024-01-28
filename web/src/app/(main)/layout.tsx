'use client';
import { ReactNode } from 'react';
import Header from '../../components/header/Header';
import CookieConsent from 'react-cookie-consent';

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
        </div>
    );
}
