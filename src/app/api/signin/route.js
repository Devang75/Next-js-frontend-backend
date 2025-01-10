import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import { createErrorResponse, createSuccessResponse, jwtSign } from '../../../commons/utils';
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    // Input validation
    const credentials = await validateInput(request);
    if (!credentials.isValid) {
      return createErrorResponse(credentials.error, 400);
    }

    // Database operations
    await connectDB();
    const user = await authenticateUser(credentials.email, credentials.password);
    if (!user.isAuthenticated) {
      return createErrorResponse(user.error, user.status);
    }

    // Generate and set token
    const token = await generateToken(user.data);
    return createAuthResponse(user.data, token);

  } catch (error) {
    console.error('Authentication Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
}

// Helper functions
async function validateInput(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return { isValid: false, error: 'Email and password are required' };
    }
    return { isValid: true, email, password };
  } catch {
    return { isValid: false, error: 'Invalid request payload' };
  }
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    return { isAuthenticated: false, error: 'User not found', status: 404 };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return { isAuthenticated: false, error: 'Invalid credentials', status: 401 };
  }

  return { isAuthenticated: true, data: user, status: 200 };
}

async function generateToken(user) {
  return await jwtSign({ id: user._id, email: user.email });
}

function createAuthResponse(user, token) {
  const response = createSuccessResponse({ user, token }, 200);
  response.cookies.set('token', token);
  return response;
}