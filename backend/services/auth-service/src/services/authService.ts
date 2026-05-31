import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { ROLES, UserRole } from "../../../../shared/constants/roles";
import { AppError } from "../../../../shared/utils/errors";
import { env } from "../../../../shared/utils/env";
import { sendOtpEmail } from "../../../../shared/utils/mailer";
import { buildPaginationMeta, getPagination } from "../../../../shared/utils/pagination";
import { User } from "../models/User";
import { SignupOtp } from "../models/SignupOtp";

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface VerifySignupPayload {
  email: string;
  otpCode: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const sanitizeUser = (user: User) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const signToken = (user: User) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: "12h" });

const generateOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

export const requestSignupOtp = async (payload: SignupPayload) => {
  const email = payload.email.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new AppError("An account with that email already exists", 409);
  }

  if (![ROLES.ADMIN, ROLES.PARKING_ATTENDANT].includes(payload.role)) {
    throw new AppError("Invalid role supplied", 400);
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const existingOtp = await SignupOtp.findOne({ where: { email } });
  if (existingOtp) {
    existingOtp.firstName = payload.firstName.trim();
    existingOtp.lastName = payload.lastName.trim();
    existingOtp.passwordHash = passwordHash;
    existingOtp.role = payload.role;
    existingOtp.otpCode = otpCode;
    existingOtp.expiresAt = expiresAt;
    existingOtp.verified = false;
    await existingOtp.save();
  } else {
    await SignupOtp.create({
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email,
      passwordHash,
      role: payload.role,
      otpCode,
      expiresAt,
    });
  }

  await sendOtpEmail(email, otpCode, payload.firstName.trim());

  return {
    message: "OTP generated successfully and sent to your email",
    email,
    expiresAt,
    otpPreview: env.nodeEnv === "development" ? otpCode : undefined,
  };
};

export const verifySignupOtp = async (payload: VerifySignupPayload) => {
  const email = payload.email.trim().toLowerCase();
  const otpRecord = await SignupOtp.findOne({ where: { email } });

  if (!otpRecord) {
    throw new AppError("No pending signup request found for that email", 404);
  }

  if (otpRecord.verified) {
    throw new AppError("This signup request was already verified", 400);
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  if (otpRecord.otpCode !== payload.otpCode.trim()) {
    throw new AppError("Invalid OTP code", 400);
  }

  const user = await User.create({
    firstName: otpRecord.firstName.trim(),
    lastName: otpRecord.lastName.trim(),
    email: otpRecord.email,
    passwordHash: otpRecord.passwordHash,
    role: otpRecord.role,
  });

  otpRecord.verified = true;
  await otpRecord.save();

  return {
    message: "Signup successful",
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

export const signup = async (payload: SignupPayload) => {
  const request = await requestSignupOtp(payload);
  return {
    message: `${request.message}. Verify the OTP to complete signup.`,
    email: request.email,
    expiresAt: request.expiresAt,
    otpPreview: request.otpPreview,
  };
};

export const createUserDirectly = async (payload: SignupPayload) => {
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash,
    role: payload.role,
  });

  return {
    message: "Signup successful",
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

export const login = async (payload: LoginPayload) => {
  const user = await User.findOne({
    where: {
      email: { [Op.eq]: payload.email.trim().toLowerCase() },
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordsMatch = await bcrypt.compare(payload.password, user.passwordHash);
  if (!passwordsMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    message: "Login successful",
    token: signToken(user),
    user: sanitizeUser(user),
  };
};

export const listUsers = async (page?: string, limit?: string) => {
  const { page: safePage, limit: safeLimit, offset } = getPagination(page, limit);
  const { rows, count } = await User.findAndCountAll({
    attributes: { exclude: ["passwordHash"] },
    order: [["createdAt", "DESC"]],
    offset,
    limit: safeLimit,
  });

  return {
    data: rows,
    pagination: buildPaginationMeta(count, safePage, safeLimit),
  };
};

export const getUserById = async (id: string) => {
  const user = await User.findByPk(id, { attributes: { exclude: ["passwordHash"] } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
