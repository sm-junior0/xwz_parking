import nodemailer from "nodemailer";
import { env } from "./env";
import { AppError } from "./errors";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

export const sendOtpEmail = async (to: string, otpCode: string, firstName: string) => {
  if (!env.mail.user || !env.mail.pass) {
    throw new AppError("Mail service is not configured", 500);
  }

  await transporter.sendMail({
    from: `"XWZ Parking System" <${env.mail.user}>`,
    to,
    subject: "Your XWZ Parking OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin-bottom: 12px;">XWZ Parking Signup Verification</h2>
        <p>Hello ${firstName},</p>
        <p>Your OTP code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #2563eb;">${otpCode}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this signup, you can ignore this email.</p>
      </div>
    `,
  });
};
