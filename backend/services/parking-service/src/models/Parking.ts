import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

interface ParkingAttributes {
  id: string;
  code: string;
  parkingName: string;
  availableSpaces: number;
  totalSpaces: number;
  location: string;
  chargingFeePerHour: number;
  createdBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type ParkingCreationAttributes = Optional<ParkingAttributes, "id" | "createdBy" | "createdAt" | "updatedAt">;

export class Parking extends Model<ParkingAttributes, ParkingCreationAttributes> implements ParkingAttributes {
  declare id: string;
  declare code: string;
  declare parkingName: string;
  declare availableSpaces: number;
  declare totalSpaces: number;
  declare location: string;
  declare chargingFeePerHour: number;
  declare createdBy: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Parking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    parkingName: { type: DataTypes.STRING(160), allowNull: false, field: "parking_name" },
    availableSpaces: { type: DataTypes.INTEGER, allowNull: false, field: "available_spaces" },
    totalSpaces: { type: DataTypes.INTEGER, allowNull: false, field: "total_spaces" },
    location: { type: DataTypes.STRING(255), allowNull: false },
    chargingFeePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "charging_fee_per_hour",
    },
    createdBy: { type: DataTypes.UUID, allowNull: true, field: "created_by" },
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  {
    sequelize: getSequelize(),
    tableName: "parkings",
    modelName: "Parking",
    underscored: true,
  }
);
