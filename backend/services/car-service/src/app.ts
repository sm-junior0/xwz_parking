import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import carRoutes from "./routes/carRoutes";
import { carSwaggerSpec } from "./config/swagger";
import { errorHandler } from "../../../shared/middleware/errorHandler";
import { env } from "../../../shared/utils/env";
import { createLogger } from "../../../shared/utils/logger";

const logger = createLogger("car-service");
export const carApp = express();

carApp.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
carApp.use(express.json());
carApp.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

carApp.get("/health", (_req, res) => res.status(200).json({ service: "car-service", status: "ok" }));
carApp.use("/api/cars", carRoutes);
carApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(carSwaggerSpec));
carApp.use(errorHandler);
