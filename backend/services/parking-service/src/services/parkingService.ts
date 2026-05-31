import { Op } from "sequelize";
import { AppError } from "../../../../shared/utils/errors";
import { buildPaginationMeta, getPagination } from "../../../../shared/utils/pagination";
import { Parking } from "../models/Parking";

interface ParkingPayload {
  code: string;
  parkingName: string;
  availableSpaces: number;
  location: string;
  chargingFeePerHour: number;
}

export const createParking = async (payload: ParkingPayload, createdBy?: string) => {
  const existing = await Parking.findOne({ where: { code: payload.code.trim().toUpperCase() } });
  if (existing) {
    throw new AppError("Parking code already exists", 409);
  }

  const parking = await Parking.create({
    code: payload.code.trim().toUpperCase(),
    parkingName: payload.parkingName.trim(),
    availableSpaces: payload.availableSpaces,
    totalSpaces: payload.availableSpaces,
    location: payload.location.trim(),
    chargingFeePerHour: payload.chargingFeePerHour,
    createdBy: createdBy || null,
  });

  return parking;
};

export const listParkings = async (query: { page?: string; limit?: string; search?: string }) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const search = query.search?.trim();

  const where = search
    ? {
        [Op.or]: [
          { code: { [Op.iLike]: `%${search}%` } },
          { parkingName: { [Op.iLike]: `%${search}%` } },
          { location: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : undefined;

  const { rows, count } = await Parking.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const getParkingByCode = async (code: string) => {
  const parking = await Parking.findOne({ where: { code: code.toUpperCase() } });
  if (!parking) {
    throw new AppError("Parking not found", 404);
  }
  return parking;
};

export const reserveSpace = async (code: string) => {
  const parking = await getParkingByCode(code);
  if (parking.availableSpaces <= 0) {
    throw new AppError("No parking spaces available", 400);
  }

  parking.availableSpaces -= 1;
  await parking.save();
  return parking;
};

export const releaseSpace = async (code: string) => {
  const parking = await getParkingByCode(code);
  if (parking.availableSpaces < parking.totalSpaces) {
    parking.availableSpaces += 1;
    await parking.save();
  }
  return parking;
};
