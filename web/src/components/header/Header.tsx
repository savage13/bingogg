import HeaderLink from './HeaderLink';

export default function Header() {
    return (
        <div className="flex items-center gap-x-4 bg-red-800 px-4 py-2">
            <HeaderLink href="/" className="text-xl">
                bingo.gg
            </HeaderLink>
            <div className="grow" />
            <HeaderLink href="/games">Games</HeaderLink>
            <HeaderLink href="/rooms">Play</HeaderLink>
            <HeaderLink href="/login">Log In</HeaderLink>
        </div>
    );
}
