import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserContextProvider } from '../context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'bingo.gg',
    description: 'The next generation of gaming bingo',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <UserContextProvider>{children}</UserContextProvider>
            </body>
        </html>
    );
}
