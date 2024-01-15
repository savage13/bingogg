import { useFloating, useHover, useInteractions } from '@floating-ui/react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';

interface HoverIconProps {
    icon: IconProp;
    children: ReactNode;
}

export default function HoverIcon({ icon, children }: HoverIconProps) {
    const [open, setOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: open,
        onOpenChange: setOpen,
    });
    const hover = useHover(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
    return (
        <>
            <FontAwesomeIcon
                icon={icon}
                className="ml-1 px-1 pb-0.5 text-sm"
                ref={refs.setReference}
                {...getReferenceProps()}
            />
            {open && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className=" z-10 max-w-md rounded-lg border border-gray-300 bg-slate-100 p-2 text-sm text-slate-700 shadow-md"
                >
                    {children}
                </div>
            )}
        </>
    );
}
