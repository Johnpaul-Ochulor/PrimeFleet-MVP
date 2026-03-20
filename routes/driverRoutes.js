import express from "express";
import upload from "../middleware/upload.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { 
  createDriver, 
  getDrivers, 
  getDriver, 
  approveDriver, 
  suspendDriver, 
  updateDriver 
} from "../controllers/driverController.js";

const router = express.Router();

// --- VIEWING ---
// Item 4: Get all drivers (Admin/Super Admin can view the list)
router.get("/", protect, restrictTo("ADMIN", "SUPER_ADMIN"), getDrivers);

// Get single driver details
router.get("/:id", protect, restrictTo("ADMIN", "SUPER_ADMIN"), getDriver);

// --- MANAGEMENT ---

// Item 4: Onboard New Driver
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

// Item 4: Approve Driver (Strictly SUPER_ADMIN as per security review)
router.patch("/:id/approve", protect, restrictTo("SUPER_ADMIN"), approveDriver);

// Item 4: Suspend Driver (Strictly SUPER_ADMIN)
router.patch("/:id/suspend", protect, restrictTo("SUPER_ADMIN"), suspendDriver);

// Update Driver details (e.g., changing phone number)
router.patch("/:id", protect, restrictTo("ADMIN", "SUPER_ADMIN"), updateDriver);

export default router;