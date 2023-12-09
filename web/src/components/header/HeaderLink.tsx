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
            } cursor-pointer rounded-sm px-3 py-2 hover:bg-gray-300 hover:bg-opacity-25`}
        >
            {children}
        </Link>
    );
}
