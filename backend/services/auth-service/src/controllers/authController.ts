import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { AuthenticatedRequest } from "../../../../shared/types/express";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifySignupOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifySignupOtp(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.listUsers(req.query.page as string, req.query.limit as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getUserById(req.user!.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
