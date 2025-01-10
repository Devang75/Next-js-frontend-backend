import { NextResponse } from 'next/server';
import { verifyJWT } from './commons/utils';
import { cookies } from 'next/headers';

const publicPaths = ['/api/signin', '/api/signup'];
const privatePaths = ['/'];
const apiPaths = ['/api/signin', '/api/signup']

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api') && !publicPaths.includes(pathname)) {
        if (pathname === '/api/signin' || pathname === '/api/signup') {
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
        }
    } else if (privatePaths.includes(pathname)) {
        const token = (await cookies()).get('token');
        const isJwtVerify = await verifyJWT(token?.value);
        if (isJwtVerify?.error) {
            const response = NextResponse.redirect(new URL('/login', request.nextUrl.origin));
            response.cookies.set('token', '', { maxAge: -1 }); // Remove the cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*', '/:path*'],
};
