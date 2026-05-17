import { Request, Response, NextFunction } from "express";

import { fetchUsers } from "./user.service";

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
