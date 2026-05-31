import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

interface CarEntryAttributes {
  id: string;
  plateNumber: string;
  parkingCode: string;
  ticketNumber: string;
  entryDateTime: Date;
  exitDateTime?: Date | null;
  chargedAmount: number;
  status: "IN" | "OUT";
  attendantId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CarEntryCreationAttributes = Optional<
  CarEntryAttributes,
  "id" | "exitDateTime" | "chargedAmount" | "status" | "attendantId" | "createdAt" | "updatedAt"
>;

export class CarEntry extends Model<CarEntryAttributes, CarEntryCreationAttributes> implements CarEntryAttributes {
  declare id: string;
  declare plateNumber: string;
  declare parkingCode: string;
  declare ticketNumber: string;
  declare entryDateTime: Date;
  declare exitDateTime: Date | null;
  declare chargedAmount: number;
  declare status: "IN" | "OUT";
  declare attendantId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CarEntry.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    plateNumber: { type: DataTypes.STRING(30), allowNull: false, field: "plate_number" },
    parkingCode: { type: DataTypes.STRING(40), allowNull: false, field: "parking_code" },
    ticketNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: "ticket_number" },
    entryDateTime: { type: DataTypes.DATE, allowNull: false, field: "entry_date_time" },
    exitDateTime: { type: DataTypes.DATE, allowNull: true, field: "exit_date_time" },
    chargedAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, field: "charged_amount" },
    status: { type: DataTypes.ENUM("IN", "OUT"), allowNull: false, defaultValue: "IN" },
    attendantId: { type: DataTypes.UUID, allowNull: true, field: "attendant_id" },
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  {
    sequelize: getSequelize(),
    tableName: "car_entries",
    modelName: "CarEntry",
    underscored: true,
  }
);
