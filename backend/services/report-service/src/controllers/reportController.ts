import { NextFunction, Request, Response } from "express";
import * as reportService from "../services/reportService";

export const enteredCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reportService.enteredCarsReport(req.query as unknown as {
      page?: string;
      limit?: string;
      startDateTime: string;
      endDateTime: string;
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const outgoingCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reportService.outgoingCarsReport(req.query as unknown as {
      page?: string;
      limit?: string;
      startDateTime: string;
      endDateTime: string;
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const revenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reportService.revenueReport(req.query as unknown as {
      page?: string;
      limit?: string;
      startDateTime: string;
      endDateTime: string;
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
