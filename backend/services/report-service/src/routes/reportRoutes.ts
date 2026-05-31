import { Router } from "express";
import { query } from "express-validator";
import { authenticate, authorize } from "../../../../shared/middleware/auth";
import { validateRequest } from "../../../../shared/middleware/validateRequest";
import { ROLES } from "../../../../shared/constants/roles";
import * as reportController from "../controllers/reportController";

const router = Router();

const dateFilters = [
  query("startDateTime").isISO8601().withMessage("startDateTime must be an ISO date time"),
  query("endDateTime").isISO8601().withMessage("endDateTime must be an ISO date time"),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

router.get("/entered-cars", authenticate, authorize(ROLES.ADMIN), dateFilters, validateRequest, reportController.enteredCars);
router.get("/outgoing-cars", authenticate, authorize(ROLES.ADMIN), dateFilters, validateRequest, reportController.outgoingCars);
router.get("/revenue", authenticate, authorize(ROLES.ADMIN), dateFilters, validateRequest, reportController.revenue);

export default router;
