import { gatewayApp } from "./app";
import { env } from "../../../shared/utils/env";

gatewayApp.listen(env.ports.gateway, () => {
  console.log(`API gateway running on port ${env.ports.gateway}`);
});
