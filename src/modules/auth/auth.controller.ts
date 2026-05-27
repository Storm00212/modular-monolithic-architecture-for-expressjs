import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { AppError } from "../../core/errors/AppError";
import { AuthenticatedRequest } from "../../core/middleware/auth.middleware";

import {
  registerUser,
  loginUser,
  getProfile
} from "./auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const getProfileController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await getProfile(req.user!.id);

    return res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
