import express from "express";
import upload from "../middleware/upload.js";
import { createDriver, getDrivers } from "../controllers/driverController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 }
  ]),
  createDriver
);

router.get("/", getDrivers);

export default router;