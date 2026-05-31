import { DataTypes, Model } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

export class Bill extends Model {
  declare id: string;
  declare entryId: string;
  declare amount: number;
  declare generatedAt: Date;
}

Bill.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    entryId: { type: DataTypes.UUID, field: "entry_id" },
    amount: { type: DataTypes.DECIMAL(10, 2) },
    generatedAt: { type: DataTypes.DATE, field: "generated_at" },
  },
  {
    sequelize: getSequelize(),
    tableName: "bills",
    modelName: "ReportBill",
    timestamps: false,
  }
);
