import express from 'express';
import { createBooking, approveBookingPayment } from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customers can book
router.post('/', protect, createBooking);

// Only Super Admin can approve the bank transfer
router.patch('/:id/approve', protect, restrictTo('SUPER_ADMIN'), approveBookingPayment);

export default router;