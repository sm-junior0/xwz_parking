import { DataTypes, Model } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

export class CarEntry extends Model {
  declare id: string;
  declare plateNumber: string;
  declare parkingCode: string;
  declare ticketNumber: string;
  declare entryDateTime: Date;
  declare exitDateTime: Date | null;
  declare chargedAmount: number;
  declare status: "IN" | "OUT";
}

CarEntry.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    plateNumber: { type: DataTypes.STRING(30), field: "plate_number" },
    parkingCode: { type: DataTypes.STRING(40), field: "parking_code" },
    ticketNumber: { type: DataTypes.STRING(50), field: "ticket_number" },
    entryDateTime: { type: DataTypes.DATE, field: "entry_date_time" },
    exitDateTime: { type: DataTypes.DATE, field: "exit_date_time" },
    chargedAmount: { type: DataTypes.DECIMAL(10, 2), field: "charged_amount" },
    status: { type: DataTypes.ENUM("IN", "OUT") },
  },
  {
    sequelize: getSequelize(),
    tableName: "car_entries",
    modelName: "ReportCarEntry",
    timestamps: false,
  }
);
