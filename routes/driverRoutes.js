import express from "express";
import upload from "../middleware/upload.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { createDriver, getDrivers, getDriver, approveDriver, suspendDriver, updateDriver } from "../controllers/driverController.js";

const router = express.Router();

// Public/Team view: See all drivers
router.get("/", protect, restrictTo("ADMIN"), getDrivers);
router.get("/:id", getDriver);

// Protected: Only Admins can create new drivers
router.post(
  "/",
  protect, 
  restrictTo('SUPER_ADMIN'),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 }
  ]),
  createDriver
);

router.patch("/:id/approve", protect, restrictTo("ADMIN"), approveDriver);
router.patch("/:id/suspend", protect, restrictTo("ADMIN"), suspendDriver);
router.patch("/:id", protect, restrictTo("ADMIN"), updateDriver);

export default router;