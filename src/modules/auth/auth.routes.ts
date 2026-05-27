import { Router } from "express";
import { authenticate } from "../../core/middleware/auth.middleware";

import {
  registerController,
  loginController,
  getProfileController
} from "./auth.controller";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", authenticate, getProfileController);

export default router;
