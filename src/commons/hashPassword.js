import bcrypt from "bcrypt";

export const HashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};