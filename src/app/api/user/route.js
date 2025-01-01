import { User } from '../../modals/users';
import connectDB from '../../../lib/dbConnect';
import { createErrorResponse, createSuccessResponse } from '../../../commons/utils';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find()
    return createSuccessResponse({ users }, 200);
  } catch (error) {
    console.error('GET Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
}

