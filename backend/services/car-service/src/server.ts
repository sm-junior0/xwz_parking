import "./models/CarEntry";
import "./models/Ticket";
import "./models/Bill";
import { carApp } from "./app";
import { env } from "../../../shared/utils/env";
import { getSequelize } from "../../../shared/utils/sequelize";

const start = async () => {
  await getSequelize().authenticate();
  await getSequelize().sync({ alter: true });

  carApp.listen(env.ports.car, () => {
    console.log(`Car service running on port ${env.ports.car}`);
  });
};

start().catch((error) => {
  console.error("Failed to start car service", error);
  process.exit(1);
});
