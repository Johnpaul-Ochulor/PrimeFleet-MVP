import express from "express";
import upload from "../middleware/upload.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";

const router = express.Router();

// Team can view vehicles
router.get("/", getVehicles);
router.get("/:id", getVehicle);

// Only Admins can manage the fleet
router.post(
  "/", 
  protect, 
  restrictTo('SUPER_ADMIN'), 
  upload.single('photo'), // Assuming 1 photo per vehicle
  createVehicle
);

router.put("/:id", protect, restrictTo('SUPER_ADMIN'), updateVehicle);
router.delete("/:id", protect, restrictTo('SUPER_ADMIN'), deleteVehicle);

export default router;