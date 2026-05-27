import { Router } from "express";
import { authenticate } from "../../core/middleware/auth.middleware";
import { authorize } from "../../core/middleware/authorize.middleware";

import {
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from "./user.controller";

const router = Router();

router.get("/", authenticate, getUsersController);
router.get("/:id", authenticate, getUserByIdController);
router.patch("/:id", authenticate, authorize(["ADMIN"]), updateUserController);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteUserController);

export default router;
