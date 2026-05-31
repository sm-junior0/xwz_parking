import { NextFunction, Request, Response } from "express";
import { env } from "../utils/env";

export const verifyServiceToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-service-token"];

  if (token !== env.serviceToken) {
    return res.status(401).json({ message: "Invalid service token" });
  }

  return next();
};
