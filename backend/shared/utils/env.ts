import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  serviceToken: process.env.SERVICE_TOKEN || "internal-service-secret",
  databaseUrl: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/xwz_parking",
  mail: {
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
  },
  ports: {
    auth: Number(process.env.AUTH_SERVICE_PORT || 5001),
    parking: Number(process.env.PARKING_SERVICE_PORT || 5002),
    car: Number(process.env.CAR_SERVICE_PORT || 5003),
    report: Number(process.env.REPORT_SERVICE_PORT || 5004),
    gateway: Number(process.env.API_GATEWAY_PORT || 5000),
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
    parking: process.env.PARKING_SERVICE_URL || "http://localhost:5002",
    car: process.env.CAR_SERVICE_URL || "http://localhost:5003",
    report: process.env.REPORT_SERVICE_URL || "http://localhost:5004",
  },
};
