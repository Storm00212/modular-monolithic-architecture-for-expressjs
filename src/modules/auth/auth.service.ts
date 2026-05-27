import bcrypt from "bcryptjs";
import { z } from "zod";

import { AppError } from "../../core/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";

import {
  findByEmail,
  createUser,
  findById,
  comparePassword
} from "./auth.repository";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const registerUser = async (data: { email: string; password: string; name: string }) => {
  const validated = registerSchema.parse(data);
  
  const existingUser = await findByEmail(validated.email);

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const user = await createUser(
    validated.email,
    hashedPassword,
    validated.name
  );

  const token = generateToken(user.id);

  const { password, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword
  };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const validated = loginSchema.parse(data);
  
  const user = await findByEmail(validated.email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await comparePassword(user, validated.password);

  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user.id);

  const { password, ...userWithoutPassword } = user;
  return {
    token,
    user: userWithoutPassword
  };
};

export const getProfile = async (userId: string) => {
  const user = await findById(userId);
  
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
