import axios from "axios";
import { Op } from "sequelize";
import { env } from "../../../../shared/utils/env";
import { AppError } from "../../../../shared/utils/errors";
import { buildPaginationMeta, getPagination } from "../../../../shared/utils/pagination";
import { CarEntry } from "../models/CarEntry";
import { Ticket } from "../models/Ticket";
import { Bill } from "../models/Bill";

const serviceClient = axios.create({
  headers: {
    "x-service-token": env.serviceToken,
  },
});

const generateRef = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const calculateHours = (entryDate: Date, exitDate: Date) => {
  const diffMs = exitDate.getTime() - entryDate.getTime();
  const rawHours = diffMs / (1000 * 60 * 60);
  return Math.max(1, Math.ceil(rawHours));
};

export const registerEntry = async (payload: { plateNumber: string; parkingCode: string }, attendantId?: string) => {
  const parkingCode = payload.parkingCode.trim().toUpperCase();
  const activeEntry = await CarEntry.findOne({
    where: {
      plateNumber: payload.plateNumber.trim().toUpperCase(),
      status: "IN",
    },
  });

  if (activeEntry) {
    throw new AppError("This car is already inside a parking", 409);
  }

  const parkingResponse = await serviceClient.get(`${env.services.parking}/api/parkings/internal/${parkingCode}`);
  const parking = parkingResponse.data;

  if (Number(parking.availableSpaces) <= 0) {
    throw new AppError("No parking spaces available", 400);
  }

  await serviceClient.patch(`${env.services.parking}/api/parkings/${parkingCode}/reserve`);

  const ticketNumber = generateRef("TKT");
  const entry = await CarEntry.create({
    plateNumber: payload.plateNumber.trim().toUpperCase(),
    parkingCode,
    ticketNumber,
    entryDateTime: new Date(),
    attendantId: attendantId || null,
  });

  const ticket = await Ticket.create({
    entryId: entry.id,
    ticketNumber,
    printedPayload: {
      plateNumber: entry.plateNumber,
      parkingCode: entry.parkingCode,
      entryDateTime: entry.entryDateTime,
    },
  });

  return {
    message: "Car entry registered successfully",
    entry,
    ticket,
  };
};

export const registerExit = async (payload: { plateNumber: string; parkingCode: string }) => {
  const parkingCode = payload.parkingCode.trim().toUpperCase();
  const plateNumber = payload.plateNumber.trim().toUpperCase();
  const entry = await CarEntry.findOne({
    where: {
      plateNumber,
      parkingCode,
      status: "IN",
    },
  });

  if (!entry) {
    throw new AppError("Active car entry not found", 404);
  }

  const parkingResponse = await serviceClient.get(`${env.services.parking}/api/parkings/internal/${parkingCode}`);
  const parking = parkingResponse.data;

  const exitDate = new Date();
  const hoursCharged = calculateHours(new Date(entry.entryDateTime), exitDate);
  const chargedAmount = hoursCharged * Number(parking.chargingFeePerHour);

  entry.exitDateTime = exitDate;
  entry.status = "OUT";
  entry.chargedAmount = chargedAmount;
  await entry.save();

  await serviceClient.patch(`${env.services.parking}/api/parkings/${parkingCode}/release`);

  const bill = await Bill.create({
    entryId: entry.id,
    billNumber: generateRef("BLL"),
    amount: chargedAmount,
    hoursCharged,
  });

  return {
    message: "Car exit registered successfully",
    entry,
    bill,
  };
};

export const listEntries = async (query: { page?: string; limit?: string; status?: string; plateNumber?: string }) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const where: Record<string, unknown> = {};

  if (query.status) {
    where.status = query.status.toUpperCase();
  }

  if (query.plateNumber) {
    where.plateNumber = { [Op.iLike]: `%${query.plateNumber.trim().toUpperCase()}%` };
  }

  const { rows, count } = await CarEntry.findAndCountAll({
    where,
    order: [["entryDateTime", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const listTickets = async (page?: string, limit?: string) => {
  const { page: safePage, limit: safeLimit, offset } = getPagination(page, limit);
  const { rows, count } = await Ticket.findAndCountAll({
    order: [["issuedAt", "DESC"]],
    offset,
    limit: safeLimit,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, safePage, safeLimit),
  };
};

export const listBills = async (page?: string, limit?: string) => {
  const { page: safePage, limit: safeLimit, offset } = getPagination(page, limit);
  const { rows, count } = await Bill.findAndCountAll({
    order: [["generatedAt", "DESC"]],
    offset,
    limit: safeLimit,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, safePage, safeLimit),
  };
};
