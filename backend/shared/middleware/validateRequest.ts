import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.array().map((error) => ({
        field: "path" in error ? error.path : "unknown",
        message: error.msg,
      })),
    });
  }

  return next();
};
