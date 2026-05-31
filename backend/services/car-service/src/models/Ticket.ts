import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

interface TicketAttributes {
  id: string;
  entryId: string;
  ticketNumber: string;
  issuedAt?: Date;
  printedPayload: object;
}

type TicketCreationAttributes = Optional<TicketAttributes, "id" | "issuedAt">;

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  declare id: string;
  declare entryId: string;
  declare ticketNumber: string;
  declare issuedAt: Date;
  declare printedPayload: object;
}

Ticket.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    entryId: { type: DataTypes.UUID, allowNull: false, unique: true, field: "entry_id" },
    ticketNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: "ticket_number" },
    issuedAt: { type: DataTypes.DATE, field: "issued_at", defaultValue: DataTypes.NOW },
    printedPayload: { type: DataTypes.JSONB, allowNull: false, field: "printed_payload" },
  },
  {
    sequelize: getSequelize(),
    tableName: "tickets",
    modelName: "Ticket",
    underscored: true,
  }
);
