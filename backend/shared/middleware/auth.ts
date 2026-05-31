import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";
import { AuthenticatedRequest } from "../types/express";

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, env.jwtSecret) as AuthenticatedRequest["user"];
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to access this resource" });
    }

    return next();
  };
};
