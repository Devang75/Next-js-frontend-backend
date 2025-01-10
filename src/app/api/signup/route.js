import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import {
  createErrorResponse,
  createSuccessResponse,
  jwtSign,
  validateUserInput
} from '../../../commons/utils';
import { HashPassword } from '../../../commons/hashPassword';

/**
 * Handles POST requests for user signup functionality.
 * Processes both regular and Google OAuth signup requests.
 * 
 * @async
 * @param {Request} request - The incoming HTTP request object containing user signup data
 * @returns {Promise<Response>} A Promise that resolves to a Response object containing:
 *                             - Success: 201 status with user data
 *                             - Error: 400 status if user exists
 *                             - Error: 500 status for server errors
 * @throws {Error} When database connection fails or data validation fails
 * 
 * The function performs the following steps:
 * 1. Connects to database
 * 2. Extracts and validates user data from request
 * 3. For Google login, checks if user already exists
 * 4. Creates new user if not exists
 * 5. Returns appropriate response based on operation result
 */
export async function POST(request) {
  try {
    await connectDB();
    const userData = await extractAndValidateUserData(request);

    if (userData.logintype === 'google') {
      const existingUser = await checkExistingUser(userData.email, userData.logintype);
      if (existingUser) {
        return handleExistingUser(existingUser);
      }
    }

    const newUser = await createNewUser(userData);
    return handleNewUser(newUser, userData.logintype);

  } catch (error) {
    console.error('POST Error:', error);
    if (error.code === 11000) {
      return createErrorResponse('User already exists with these credentials', 400);
    }
    return createErrorResponse(error.message || 'Internal Server Error', 500);
  }
}

async function extractAndValidateUserData(request) {
  const { firstname, lastname, username, email, password, logintype } = await request.json();
  validateUserInput({ firstname, lastname, username, email, password, logintype });
  return { firstname, lastname, username, email, password, logintype };
}

async function checkExistingUser(email, logintype) {
  const user = await User.findOne({ email, logintype });
  return user?.logintype === 'google' ? user : null;
}

async function handleExistingUser(user) {
  const token = await jwtSign({ id: user._id, email: user.email });
  const response = createSuccessResponse({ user, token }, 200);
  response.cookies.set('token', token);
  return response;
}

async function createNewUser(userData) {
  const hashedPassword = await HashPassword(userData.password);
  return await User.create({
    ...userData,
    password: hashedPassword
  });
}

async function handleNewUser(user, logintype) {
  if (logintype === 'google') {
    const token = await jwtSign({ id: user._id, email: user.email });
    const response = createSuccessResponse({ user, token }, 201);
    response.cookies.set('token', token);
    return response;
  }
  return createSuccessResponse({ user }, 201);
}