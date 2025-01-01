import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from 'jose';

// Error response helper
export const createErrorResponse = (message, status) => {
    return NextResponse.json({ error: message }, { status });
};

// Success response helper
export const createSuccessResponse = (data, status) => {
    return NextResponse.json(data, { status });
};

// Input validation
export const validateUserInput = (payload) => {
    const { firstname, lastname, username, email, password } = payload;
    if (!firstname || !lastname || !username || !email || !password) {
        return NextResponse.json({error: 'All fields are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({error: 'Invalid email format' }, { status: 400 });
    }
};

export const jwtSign = async (payload) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT(payload)
        .setIssuedAt()
        .setExpirationTime('2h')
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .sign(secret);
    return token;
};

export const verifyJWT = async (token) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
};