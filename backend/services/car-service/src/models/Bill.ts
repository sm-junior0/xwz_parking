import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

interface BillAttributes {
  id: string;
  entryId: string;
  billNumber: string;
  amount: number;
  hoursCharged: number;
  generatedAt?: Date;
  paymentStatus: "PENDING" | "PAID";
}

type BillCreationAttributes = Optional<BillAttributes, "id" | "generatedAt" | "paymentStatus">;

export class Bill extends Model<BillAttributes, BillCreationAttributes> implements BillAttributes {
  declare id: string;
  declare entryId: string;
  declare billNumber: string;
  declare amount: number;
  declare hoursCharged: number;
  declare generatedAt: Date;
  declare paymentStatus: "PENDING" | "PAID";
}

Bill.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    entryId: { type: DataTypes.UUID, allowNull: false, unique: true, field: "entry_id" },
    billNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: "bill_number" },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    hoursCharged: { type: DataTypes.INTEGER, allowNull: false, field: "hours_charged" },
    generatedAt: { type: DataTypes.DATE, field: "generated_at", defaultValue: DataTypes.NOW },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID"),
      allowNull: false,
      defaultValue: "PENDING",
      field: "payment_status",
    },
  },
  {
    sequelize: getSequelize(),
    tableName: "bills",
    modelName: "Bill",
    underscored: true,
  }
);
