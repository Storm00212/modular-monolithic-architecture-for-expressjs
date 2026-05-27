import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/errors/AppError";
import { z } from "zod";

import {
  fetchUsers,
  getUserById,
  updateUser,
  deleteUser
} from "./user.service";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional()
});

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await fetchUsers();

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await updateUser(req.params.id, validatedData);

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteUser(req.params.id);

    return res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
