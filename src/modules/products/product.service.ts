import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "./product.repository";

export const fetchProducts = async () => {
  return getProducts();
};

export const findProductById = async (id: string) => {
  return getProductById(id);
};

export const createProductService = async (data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdBy: string;
}) => {
  return createProduct(data);
};

export const updateProductService = async (id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}) => {
  return updateProduct(id, data);
};

export const deleteProductService = async (id: string) => {
  return deleteProduct(id);
};