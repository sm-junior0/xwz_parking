import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "../../../../shared/utils/env";

const proxyConfig = {
  changeOrigin: true,
  xfwd: true,
  pathRewrite: (_path: string, req: any) => req.originalUrl,
};

export const registerProxyRoutes = (app: Application) => {
  app.use("/api/auth", createProxyMiddleware({ ...proxyConfig, target: env.services.auth }));
  app.use("/api/parkings", createProxyMiddleware({ ...proxyConfig, target: env.services.parking }));
  app.use("/api/cars", createProxyMiddleware({ ...proxyConfig, target: env.services.car }));
  app.use("/api/reports", createProxyMiddleware({ ...proxyConfig, target: env.services.report }));
};
