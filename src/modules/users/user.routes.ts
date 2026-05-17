import { Router } from "express";

import {
  getUsersController
} from "./user.controller";

const router = Router();

router.get("/", getUsersController);

export default router;
