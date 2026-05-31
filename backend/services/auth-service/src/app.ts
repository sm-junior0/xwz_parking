import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes";
import { authSwaggerSpec } from "./config/swagger";
import { errorHandler } from "../../../shared/middleware/errorHandler";
import { env } from "../../../shared/utils/env";
import { createLogger } from "../../../shared/utils/logger";

const logger = createLogger("auth-service");
export const authApp = express();

authApp.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
authApp.use(express.json());
authApp.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

authApp.get("/health", (_req, res) => res.status(200).json({ service: "auth-service", status: "ok" }));
authApp.use("/api/auth", authRoutes);
authApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(authSwaggerSpec));
authApp.use(errorHandler);
