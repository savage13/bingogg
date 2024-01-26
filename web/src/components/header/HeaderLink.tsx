import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderLinkProps {
    children: ReactNode;
    href: string;
    className?: string;
}

export default function HeaderLink({
    children,
    href,
    className,
}: HeaderLinkProps) {
    return (
        <Link
            href={href}
            className={`${
                className ?? ''
            } cursor-pointer rounded-lg px-3 py-2 hover:bg-primary-content hover:bg-opacity-40`}
        >
            {children}
        </Link>
    );
}
