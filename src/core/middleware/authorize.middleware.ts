import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "./auth.middleware";

export const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not authorized to access this resource", 403));
    }

    next();
  };
};