import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../../shared/types/express";
import * as carService from "../services/carService";

export const registerEntry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await carService.registerEntry(req.body, req.user?.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const registerExit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await carService.registerExit(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await carService.listEntries(req.query as Record<string, string>);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await carService.listTickets(req.query.page as string, req.query.limit as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listBills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await carService.listBills(req.query.page as string, req.query.limit as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
