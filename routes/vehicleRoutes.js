import express from "express";
import upload from "../middleware/upload.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus // Added this new export
} from "../controllers/vehicleController.js";

const router = express.Router();

// --- PUBLIC / TEAM ACCESS ---
// Item 3: URL correctly uses / and /:id
router.get("/", getVehicles);
router.get("/:id", getVehicle);

// --- ADMIN ONLY (Fleet Management) ---

// Item 3: Add New Vehicle (Handles year and inspectionRecord in controller)
router.post(
  "/", 
  protect, 
  restrictTo('SUPER_ADMIN'), 
  upload.single('photo'), 
  createVehicle
);

// Item 3: Update Vehicle details
router.put("/:id", protect, restrictTo('SUPER_ADMIN'), updateVehicle);

// Item 3: Mark Vehicle Active/Inactive (ENTIRELY NEW ENDPOINT)
// Action: Build PATCH /api/v1/vehicles/:id/status
router.patch("/:id/status", protect, restrictTo('SUPER_ADMIN'), updateVehicleStatus);

// Item 3: Remove Vehicle (Action: Change method from GET to DELETE)
router.delete("/:id", protect, restrictTo('SUPER_ADMIN'), deleteVehicle);

export default router;