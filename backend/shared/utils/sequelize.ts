import { Sequelize } from "sequelize";
import { env } from "./env";

let sequelize: Sequelize | null = null;

export const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(env.databaseUrl, {
      dialect: "postgres",
      logging: false,
    });
  }

  return sequelize;
};
