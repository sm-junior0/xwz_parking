import "./models/User";
import "./models/SignupOtp";
import { authApp } from "./app";
import { env } from "../../../shared/utils/env";
import { getSequelize } from "../../../shared/utils/sequelize";

const port = env.ports.auth;

const start = async () => {
  await getSequelize().authenticate();
  await getSequelize().sync({ alter: true });

  authApp.listen(port, () => {
    console.log(`Auth service running on port ${port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start auth service", error);
  process.exit(1);
});
