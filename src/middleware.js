import { NextResponse } from 'next/server';
import { verifyJWT } from './commons/utils';
import { getCookie } from 'cookies-next';

const publicPaths = ['/api/signin', '/api/signup'];
const privatePaths = ['/'];

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api') && !publicPaths.includes(pathname)) {
        const token = request.headers.get('Authorization');
        if (!token) {
            return NextResponse.json(
                { error: 'Authorization token is required' },
                { status: 401 }
            );
        }

        const isJwtVerify = await verifyJWT(token);
        if (isJwtVerify?.error) {
            return NextResponse.json(
                { error: isJwtVerify.error },
                { status: 401 }
            );
        }
    } else if (privatePaths.includes(pathname)) {
        const token = await getCookie('token', { req: request });
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/:path*'],
};
