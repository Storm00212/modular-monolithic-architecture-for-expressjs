import { prisma } from "../../config/db";

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

export const comparePassword = async (user: { id: string; email: string; password: string; name: string; role: string; createdAt: Date; updatedAt: Date }, candidatePassword: string) => {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(candidatePassword, user.password);
};
