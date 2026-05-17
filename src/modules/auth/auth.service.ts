import bcrypt from "bcryptjs";

import { AppError } from "../../core/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";

import {
  findByEmail,
  createUser
} from "./auth.repository";

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(
    email,
    hashedPassword,
    name
  );

  const token = generateToken(user.id);

  return {
    token,
    user
  };
};
