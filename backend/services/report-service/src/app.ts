import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import reportRoutes from "./routes/reportRoutes";
import { reportSwaggerSpec } from "./config/swagger";
import { errorHandler } from "../../../shared/middleware/errorHandler";
import { env } from "../../../shared/utils/env";
import { createLogger } from "../../../shared/utils/logger";

const logger = createLogger("report-service");
export const reportApp = express();

reportApp.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
reportApp.use(express.json());
reportApp.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

reportApp.get("/health", (_req, res) => res.status(200).json({ service: "report-service", status: "ok" }));
reportApp.use("/api/reports", reportRoutes);
reportApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(reportSwaggerSpec));
reportApp.use(errorHandler);
