import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.rewrite(
        `${process.env.API_PATH}/${request.nextUrl.pathname}`,
    );
}

export const config = {
    matcher: '/api/:path*',
};
