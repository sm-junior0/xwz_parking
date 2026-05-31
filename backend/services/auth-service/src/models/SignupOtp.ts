import { DataTypes, Model, Optional } from "sequelize";
import { getSequelize } from "../../../../shared/utils/sequelize";

interface SignupOtpAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: "admin" | "parking_attendant";
  otpCode: string;
  expiresAt: Date;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type SignupOtpCreationAttributes = Optional<SignupOtpAttributes, "id" | "verified" | "createdAt" | "updatedAt">;

export class SignupOtp extends Model<SignupOtpAttributes, SignupOtpCreationAttributes> implements SignupOtpAttributes {
  declare id: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare passwordHash: string;
  declare role: "admin" | "parking_attendant";
  declare otpCode: string;
  declare expiresAt: Date;
  declare verified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SignupOtp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.ENUM("admin", "parking_attendant"),
      allowNull: false,
    },
    otpCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      field: "otp_code",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    sequelize: getSequelize(),
    modelName: "SignupOtp",
    tableName: "signup_otps",
    underscored: true,
  }
);
