import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// Error response helper
const createErrorResponse = (message, status) => {
  return NextResponse.json({ error: message }, { status });
};

// Success response helper
const createSuccessResponse = (data, status) => {
  return NextResponse.json(data, { status });
};

// Input validation
const validateUserInput = ({ firstname, lastname, username, email, password }) => {
  if (!firstname || !lastname || !username || !email || !password) {
    throw new Error('All fields are required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  // Add more validation as needed
};

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password'); // Exclude password from response
    return createSuccessResponse({ users }, 200);
  } catch (error) {
    console.error('GET Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    validateUserInput(body);

    const { firstname, lastname, username, email, password } = body;
    await connectDB();

    const user = new User({
      firstname,
      lastname,
      username,
      email,
      password: password // Consider hashing password here if not done in schema
    });

    await user.save();
    const userResponse = { ...user.toObject(), password: undefined }; // Remove password from response
    return createSuccessResponse({ user: userResponse }, 201);

  } catch (error) {
    console.error('POST Error:', error);
    
    if (error.code === 11000) {
      return createErrorResponse('Duplicate entry found', 400);
    }
    if (error.message === 'All fields are required' || error.message === 'Invalid email format') {
      return createErrorResponse(error.message, 400);
    }
    return createErrorResponse('Internal Server Error', 500);
  }
}

export async function middleware(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const decoded = verify(token.value, process.env.JWT_SECRET);
    request.user = decoded; // Attach user info to request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);
    return createErrorResponse('Invalid token', 401);
  }
}

