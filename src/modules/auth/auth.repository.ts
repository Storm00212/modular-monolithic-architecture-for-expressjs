import { prisma } from "../../config/db";

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
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
