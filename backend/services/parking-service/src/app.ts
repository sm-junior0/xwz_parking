import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import parkingRoutes from "./routes/parkingRoutes";
import { parkingSwaggerSpec } from "./config/swagger";
import { errorHandler } from "../../../shared/middleware/errorHandler";
import { env } from "../../../shared/utils/env";
import { createLogger } from "../../../shared/utils/logger";

const logger = createLogger("parking-service");
export const parkingApp = express();

parkingApp.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
parkingApp.use(express.json());
parkingApp.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

parkingApp.get("/health", (_req, res) => res.status(200).json({ service: "parking-service", status: "ok" }));
parkingApp.use("/api/parkings", parkingRoutes);
parkingApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(parkingSwaggerSpec));
parkingApp.use(errorHandler);
