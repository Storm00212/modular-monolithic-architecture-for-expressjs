import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const findById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  return prisma.user.create({
    data: {
      email,
      password,
      name
    }
  });
};

export const comparePasswords = async (user: { password: string }, candidatePassword: string) => {
  return bcrypt.compare(candidatePassword, user.password);
};
