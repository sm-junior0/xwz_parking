import { NextFunction, Request, Response } from "express";
import { AxiosError } from "axios";
import { ValidationError } from "sequelize";
import { AppError } from "../utils/errors";
import { createLogger } from "../utils/logger";

const logger = createLogger("error-handler");

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error.message, { stack: error.stack });

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorType: error.name,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((entry) => entry.message),
    });
  }

  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return res.status(axiosError.response?.status || 502).json({
      message: axiosError.response?.data?.message || "Service communication failed",
      errorType: "AxiosError",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    errorType: "UnhandledError",
    detail: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};
