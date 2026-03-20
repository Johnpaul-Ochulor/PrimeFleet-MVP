import express from 'express';
import { createBooking, approveBookingPayment,
  getBookingByReference,
  getAllBookings,
  assignDriver, generateQuote } from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customers can create booking
router.post('/', protect, createBooking);

// Generate a price quote
router.post('/quote', protect, generateQuote);

// Customer tracking (can be public OR protected depending on your design)
router.get('/reference/:reference', getBookingByReference);


// Admin: get all bookings
router.get('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), getAllBookings);

// Admin: assign driver
router.patch('/:id/assign-driver', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), assignDriver);

// Super Admin: approve payment
router.patch('/:id/approve', protect, restrictTo('SUPER_ADMIN'), approveBookingPayment);

export default router;