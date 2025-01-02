import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import { createErrorResponse, createSuccessResponse, jwtSign } from '../../../commons/utils';
import bcrypt from "bcrypt";

// Sign in existing user
export async function POST(request) {
    try {
      const { email, password } = await request.json();
      
      if (!email || !password) {
        return createErrorResponse('Email and password are required', 400);
      }
  
      await connectDB();
      const user = await User.findOne({ email });
  
      if (!user) {
        return createErrorResponse('User not found', 404);
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return createErrorResponse('Invalid credentials', 401);
      }
  
      const token = await jwtSign({id: user._id, email: user.email});
      const response = createSuccessResponse({ user, token }, 200);
      response.cookies.set('token', token, { httpOnly: true });
  
      return response;
    } catch (error) {
      console.error('POST Error:', error);
      return createErrorResponse('Internal Server Error', 500);
    }
  }