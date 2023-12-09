import { ReactNode } from 'react';
import Header from '../../components/header/Header';

export default function CoreLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <div className="p-4">{children}</div>
        </>
    );
}
