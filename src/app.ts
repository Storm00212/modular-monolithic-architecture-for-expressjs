import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import productRoutes from "./modules/products/product.routes";

import { errorMiddleware } from "./core/middleware/error.middleware";
import { requestLogger } from "./core/middleware/requestLogger.middleware";
import { rateLimiter } from "./core/middleware/rateLimiter.middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(rateLimiter(100, 60000));

app.get("/", (_, res) => {
  res.json({
    message: "Backend running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      users: "/api/v1/users",
      products: "/api/v1/products"
    }
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.use(errorMiddleware);

export default app;
