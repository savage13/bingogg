'use client';
import { useRouter } from 'next/navigation';
import { useUnmount } from 'react-use';

/**
 * Empty utility component that forces the next render of the parent component
 * to refetch data, even for server components during a client (soft) navigation
 */
export default function CacheBreaker() {
    const router = useRouter();
    useUnmount(() => {
        router.refresh();
    });
    return null;
}
