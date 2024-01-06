import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log(request.nextUrl);
    return NextResponse.rewrite(
        `${process.env.API_PATH}/${request.nextUrl.pathname}${
            request.nextUrl.search ? `?${request.nextUrl.search}` : ''
        }`,
    );
}

export const config = {
    matcher: '/api/:path*',
};
