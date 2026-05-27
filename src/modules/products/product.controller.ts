import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../../core/errors/AppError";
import { AuthenticatedRequest } from "../../core/middleware/auth.middleware";

import {
  fetchProducts,
  findProductById,
  createProductService,
  updateProductService,
  deleteProductService
} from "./product.service";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0).optional()
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional()
});

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await fetchProducts();

    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await createProductService({
      ...validatedData,
      createdBy: req.user!.id
    });

    return res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const updateProductController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);
    const product = await updateProductService(req.params.id, validatedData);

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const deleteProductController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteProductService(req.params.id);

    return res.json({
      success: true,
      message: "Product deleted"
    });
  } catch (error) {
    next(error);
  }
};