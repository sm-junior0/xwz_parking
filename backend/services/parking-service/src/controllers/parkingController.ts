import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../../../shared/types/express";
import * as parkingService from "../services/parkingService";

export const createParking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await parkingService.createParking(req.body, req.user?.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const listParkings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await parkingService.listParkings(req.query as Record<string, string>);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getParkingByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await parkingService.getParkingByCode(String(req.params.code));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const reserveSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await parkingService.reserveSpace(String(req.params.code));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const releaseSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await parkingService.releaseSpace(String(req.params.code));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
