import { Router } from "express";
import { authenticate } from "../../core/middleware/auth.middleware";

import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
} from "./product.controller";

const router = Router();

router.get("/", getProductsController);
router.get("/:id", getProductByIdController);
router.post("/", authenticate, createProductController);
router.patch("/:id", authenticate, updateProductController);
router.delete("/:id", authenticate, deleteProductController);

export default router;