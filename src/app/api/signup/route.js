import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import { createErrorResponse, createSuccessResponse, validateUserInput } from '../../../commons/utils';
import { HashPassword } from '../../../commons/hashPassword';

// Sign up new user
export async function POST(request) {
    try {
      // Extract and validate request body
      const { firstname, lastname, username, email, password } = await request.json();
      validateUserInput({ firstname, lastname, username, email, password });
  
      await connectDB();
      const hashedPassword = await HashPassword(password);
  
      // Create and save new user
      const user = await User.create({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword
      });
  
      return createSuccessResponse({ user }, 201);
    } catch (error) {
      // Handle specific errors
      if (error.code === 11000) {
        return createErrorResponse('User already exists with these credentials', 400);
      }
      console.error('POST Error:', error);
      return createErrorResponse(error.message || 'Internal Server Error', 500);
    }
  }