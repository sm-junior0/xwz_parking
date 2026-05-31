import "./models/CarEntry";
import "./models/Bill";
import { reportApp } from "./app";
import { env } from "../../../shared/utils/env";
import { getSequelize } from "../../../shared/utils/sequelize";

const start = async () => {
  await getSequelize().authenticate();
  await getSequelize().sync({ alter: true });

  reportApp.listen(env.ports.report, () => {
    console.log(`Report service running on port ${env.ports.report}`);
  });
};

start().catch((error) => {
  console.error("Failed to start report service", error);
  process.exit(1);
});
