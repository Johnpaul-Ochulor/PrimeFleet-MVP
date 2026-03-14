import express from "express";
import upload from "../middleware/upload.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { createDriver, getDrivers, getDriver } from "../controllers/driverController.js";

const router = express.Router();

// Public/Team view: See all drivers
router.get("/", getDrivers);
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

export default router;