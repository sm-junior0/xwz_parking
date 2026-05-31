import { Op, fn, col } from "sequelize";
import { buildPaginationMeta, getPagination } from "../../../../shared/utils/pagination";
import { CarEntry } from "../models/CarEntry";
import { Bill } from "../models/Bill";

const getDateRangeWhere = (startDateTime: string, endDateTime: string, field: string) => ({
  [field]: {
    [Op.between]: [new Date(startDateTime), new Date(endDateTime)],
  },
});

export const enteredCarsReport = async (query: {
  page?: string;
  limit?: string;
  startDateTime: string;
  endDateTime: string;
}) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const { rows, count } = await CarEntry.findAndCountAll({
    where: getDateRangeWhere(query.startDateTime, query.endDateTime, "entryDateTime"),
    order: [["entryDateTime", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const outgoingCarsReport = async (query: {
  page?: string;
  limit?: string;
  startDateTime: string;
  endDateTime: string;
}) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const { rows, count } = await CarEntry.findAndCountAll({
    where: getDateRangeWhere(query.startDateTime, query.endDateTime, "exitDateTime"),
    order: [["exitDateTime", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const revenueReport = async (query: {
  page?: string;
  limit?: string;
  startDateTime: string;
  endDateTime: string;
}) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const where = getDateRangeWhere(query.startDateTime, query.endDateTime, "generatedAt");
  const { rows, count } = await Bill.findAndCountAll({
    where,
    order: [["generatedAt", "DESC"]],
    limit,
    offset,
  });

  const total = (await Bill.findOne({
    where,
    attributes: [[fn("COALESCE", fn("SUM", col("amount")), 0), "totalAmount"]],
    raw: true,
  })) as { totalAmount: string } | null;

  return {
    data: rows,
    totalAmountCharged: Number(total?.totalAmount || 0),
    pagination: buildPaginationMeta(count, page, limit),
  };
};
