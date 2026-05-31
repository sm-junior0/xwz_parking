import { Router } from "express";
import { body, query } from "express-validator";
import { signup, login, listUsers, me, verifySignupOtp } from "../controllers/authController";
import { authenticate, authorize } from "../../../../shared/middleware/auth";
import { validateRequest } from "../../../../shared/middleware/validateRequest";
import { ROLES } from "../../../../shared/constants/roles";

const router = Router();

router.post(
  "/signup",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn([ROLES.ADMIN, ROLES.PARKING_ATTENDANT]).withMessage("Role is invalid"),
  ],
  validateRequest,
  signup
);

router.post(
  "/signup/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otpCode").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  validateRequest,
  verifySignupOtp
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
);

router.get(
  "/users",
  authenticate,
  authorize(ROLES.ADMIN),
  [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })],
  validateRequest,
  listUsers
);

router.get("/me", authenticate, me);

export default router;
