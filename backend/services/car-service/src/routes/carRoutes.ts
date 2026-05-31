import { Router } from "express";
import { body, query } from "express-validator";
import { authenticate, authorize } from "../../../../shared/middleware/auth";
import { validateRequest } from "../../../../shared/middleware/validateRequest";
import { ROLES } from "../../../../shared/constants/roles";
import * as carController from "../controllers/carController";

const router = Router();

router.post(
  "/entries",
  authenticate,
  authorize(ROLES.PARKING_ATTENDANT, ROLES.ADMIN),
  [body("plateNumber").trim().notEmpty(), body("parkingCode").trim().notEmpty()],
  validateRequest,
  carController.registerEntry
);

router.post(
  "/exits",
  authenticate,
  authorize(ROLES.PARKING_ATTENDANT, ROLES.ADMIN),
  [body("plateNumber").trim().notEmpty(), body("parkingCode").trim().notEmpty()],
  validateRequest,
  carController.registerExit
);

router.get(
  "/entries",
  authenticate,
  [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })],
  validateRequest,
  carController.listEntries
);

router.get("/tickets", authenticate, validateRequest, carController.listTickets);
router.get("/bills", authenticate, validateRequest, carController.listBills);

export default router;
