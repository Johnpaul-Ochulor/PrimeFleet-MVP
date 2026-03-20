import express from 'express';
import { 
  createBooking, 
  updateBookingStatus,
  getBookingByReference,
  getAllBookings,
  assignDriver,
  cancelBooking // Added this
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- CUSTOMER ENDPOINTS ---

// Create new booking (Item 1 in Notion)
router.post('/', createBooking);

// Get booking by reference number 
// Path updated to /:reference to match the Lead's requirement exactly
router.get('/:reference', getBookingByReference);


// --- ADMIN & SUPER ADMIN ENDPOINTS ---

// Get all bookings
router.get('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), getAllBookings);

// Update booking status / Approve Payment 
// Using /status as the primary endpoint for status transitions
router.patch('/:id/status', protect, restrictTo('SUPER_ADMIN'), updateBookingStatus);

// Assign driver to booking 
router.patch('/:id/assign-driver', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), assignDriver);

// Cancel booking 
router.patch('/:id/cancel', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), cancelBooking);

export default router;