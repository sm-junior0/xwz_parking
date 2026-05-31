import "./models/Parking";
import { parkingApp } from "./app";
import { env } from "../../../shared/utils/env";
import { getSequelize } from "../../../shared/utils/sequelize";

const start = async () => {
  await getSequelize().authenticate();
  await getSequelize().sync({ alter: true });

  parkingApp.listen(env.ports.parking, () => {
    console.log(`Parking service running on port ${env.ports.parking}`);
  });
};

start().catch((error) => {
  console.error("Failed to start parking service", error);
  process.exit(1);
});
