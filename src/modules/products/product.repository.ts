import { prisma } from "../../config/db";

export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdBy: string;
}) => {
  return prisma.product.create({
    data: {
      ...data,
      stock: data.stock || 0
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const updateProduct = async (id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id }
  });
};