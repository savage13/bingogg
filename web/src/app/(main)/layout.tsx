import { ReactNode } from 'react';
import Header from '../../components/header/Header';

export default function CoreLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen bg-background text-text">
            <Header />
            <div className="h-[calc(100%-60px)] p-4">{children}</div>
        </div>
    );
}
