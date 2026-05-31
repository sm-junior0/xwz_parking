import "../services/auth-service/src/models/User";
import bcrypt from "bcryptjs";
import { getSequelize } from "../shared/utils/sequelize";
import { User } from "../services/auth-service/src/models/User";

const seed = async () => {
  await getSequelize().authenticate();
  await getSequelize().sync();

  const existing = await User.findOne({ where: { email: "admin@xwz.com" } });
  if (existing) {
    console.log("Admin already exists: admin@xwz.com");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await User.create({
    firstName: "System",
    lastName: "Admin",
    email: "admin@xwz.com",
    passwordHash,
    role: "admin",
  });

  console.log("Seeded admin user: admin@xwz.com / Admin123!");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Failed to seed admin", error);
  process.exit(1);
});
