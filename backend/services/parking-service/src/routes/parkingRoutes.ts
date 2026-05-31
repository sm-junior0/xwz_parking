import { Router } from "express";
import { body, param, query } from "express-validator";
import { authenticate, authorize } from "../../../../shared/middleware/auth";
import { validateRequest } from "../../../../shared/middleware/validateRequest";
import { verifyServiceToken } from "../../../../shared/middleware/serviceAuth";
import { ROLES } from "../../../../shared/constants/roles";
import * as parkingController from "../controllers/parkingController";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  [
    body("code").trim().notEmpty(),
    body("parkingName").trim().notEmpty(),
    body("availableSpaces").isInt({ min: 0 }),
    body("location").trim().notEmpty(),
    body("chargingFeePerHour").isFloat({ min: 0 }),
  ],
  validateRequest,
  parkingController.createParking
);

router.get(
  "/",
  authenticate,
  [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })],
  validateRequest,
  parkingController.listParkings
);

router.get("/:code", authenticate, [param("code").trim().notEmpty()], validateRequest, parkingController.getParkingByCode);

router.get(
  "/internal/:code",
  verifyServiceToken,
  [param("code").trim().notEmpty()],
  validateRequest,
  parkingController.getParkingByCode
);

router.patch(
  "/:code/reserve",
  verifyServiceToken,
  [param("code").trim().notEmpty()],
  validateRequest,
  parkingController.reserveSpace
);

router.patch(
  "/:code/release",
  verifyServiceToken,
  [param("code").trim().notEmpty()],
  validateRequest,
  parkingController.releaseSpace
);

export default router;
