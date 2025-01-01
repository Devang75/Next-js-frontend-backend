import { NextResponse } from 'next/server';
import { verifyJWT } from './commons/utils';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const publicPaths = ['/api/signin', '/api/signup', '/api/public/'];
    if (!publicPaths.includes(pathname)) {
        const token = request.headers.get('authorization');
        const isJwtVerify = await verifyJWT(token);

        if (!isJwtVerify) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*'
};
