import cors from "cors";
import express from "express";
import morgan from "morgan";
import { registerProxyRoutes } from "./routes/proxyRoutes";
import { env } from "../../../shared/utils/env";
import { createLogger } from "../../../shared/utils/logger";

const logger = createLogger("api-gateway");
export const gatewayApp = express();

gatewayApp.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
gatewayApp.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

gatewayApp.get("/health", (_req, res) => {
  res.status(200).json({
    service: "api-gateway",
    status: "ok",
    services: {
      auth: `${env.services.auth}/health`,
      parking: `${env.services.parking}/health`,
      car: `${env.services.car}/health`,
      report: `${env.services.report}/health`,
    },
  });
});

gatewayApp.get("/api/docs", (_req, res) => {
  res.status(200).json({
    authServiceDocs: `${env.services.auth}/api-docs`,
    parkingServiceDocs: `${env.services.parking}/api-docs`,
    carServiceDocs: `${env.services.car}/api-docs`,
    reportServiceDocs: `${env.services.report}/api-docs`,
  });
});

registerProxyRoutes(gatewayApp);
