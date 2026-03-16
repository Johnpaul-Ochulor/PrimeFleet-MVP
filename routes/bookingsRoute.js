import express from "express";
import {
  createBooking,
  getQuote,
  updateBookingStatus
} from "../controllers/bookingsController.js";

const router = express.Router();

router.post("/", createBooking);

router.post("/quote", getQuote);

router.patch("/:id/status", updateBookingStatus);

export default router;