'use client';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

export default function TextFit({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [optimizedFontSize, setOptimizedFontSize] = useState('');
    const [transform, setTransform] = useState('');

    const fit = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;
        let scaleX = container.clientWidth / content.clientWidth;
        let scaleY = container.clientHeight / content.clientHeight;
        const fontSize = window.getComputedStyle(content).fontSize;
        if (scaleY < 0.8 || scaleX < 0.7) {
            setOptimizedFontSize(`calc(${fontSize} * 0.9)`);
            return;
        }
        scaleX = Math.min(1, scaleX);
        scaleY = Math.min(1, scaleY);
        setTransform(`scaleX(${scaleX}) scaleY(${scaleY})`);
    }, []);

    const resetFit = useCallback(() => {
        console.log('in reset fit');
        setOptimizedFontSize('20px');
        fit();
    }, [fit]);

    useLayoutEffect(() => {
        fit();
    }, [optimizedFontSize, fit]);

    useEffect(() => {
        setOptimizedFontSize('20px');
        window.addEventListener('resize', resetFit);
        return () => window.removeEventListener('resize', resetFit);
    }, [resetFit]);

    return (
        <div
            ref={containerRef}
            className="flex h-full w-full items-center justify-center"
        >
            <div
                ref={contentRef}
                className={className}
                style={{ transform, fontSize: optimizedFontSize }}
            >
                {text}
            </div>
        </div>
    );
}
