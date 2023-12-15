'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    const [top, setTop] = useState('');

    // const fit = useCallback((depth: number) => {
    //     console.log(depth);
    //     const transform = 'scaleX(1) scaleY(1)';
    //     const container = containerRef.current;
    //     const content = contentRef.current;
    //     if (!container || !content) return;
    //     let scaleX = container.clientWidth / content.clientWidth;
    //     let scaleY = container.clientHeight / content.clientHeight;
    //     const fontSize = window.getComputedStyle(content).fontSize;
    //     if (depth < 10 && (scaleY < 0.8 || scaleX < 0.7)) {
    //         setOptimizedFontSize(`calc(${fontSize} * 0.9)`);
    //         console.log(optimizedFontSize);
    //         fit(depth + 1);
    //         return;
    //     }
    //     scaleX = Math.min(1, scaleX);
    //     scaleY = Math.min(1, scaleY);
    //     var toLeft = (container.scrollWidth - content.scrollWidth) / 2;
    //     setTransform(
    //         `translateY(-50%) translateX(${toLeft}px) scaleX(${scaleX}) scaleY(${scaleY})`,
    //     );
    //     setTop('50%');
    // }, [optimizedFontSize]);

    // const handleResize = useCallback(() => {
    //     console.log('fitting');
    //     // fit(0);
    // }, [fit]);

    // useEffect(() => {
    //     const listener = window.addEventListener('resize', handleResize);
    //     // fit(0);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, [handleResize, fit]);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;
        console.log(container.clientHeight);
        console.log(content.clientHeight);
        let scaleX = container.clientWidth / content.clientWidth;
        let scaleY = container.clientHeight / content.clientHeight;
        const fontSize = window.getComputedStyle(content).fontSize;
        console.log(`${fontSize} ${scaleX} ${scaleY}`);
        if (scaleY < 0.8 || scaleX < 0.7) {
            setOptimizedFontSize(`calc(${fontSize} * 0.9)`);
            return;
        }
        scaleX = Math.min(1, scaleX);
        scaleY = Math.min(1, scaleY);
        var toLeft = (container.scrollWidth - content.scrollWidth) / 2;
        setTransform(`scaleX(${scaleX}) scaleY(${scaleY})`);
    }, [optimizedFontSize]);

    useEffect(() => {
        setOptimizedFontSize('20px');
    }, []);

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
