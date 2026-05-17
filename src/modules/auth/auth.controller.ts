import { Request, Response, NextFunction } from "express";

import { registerUser } from "./auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const result = await registerUser(
      email,
      password,
      name
    );

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
