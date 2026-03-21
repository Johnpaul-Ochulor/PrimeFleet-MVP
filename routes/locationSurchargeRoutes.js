import express from 'express';
import {
  getAllSurcharges,
  createSurcharge,
  updateSurcharge,
  deleteSurcharge
} from '../controllers/locationSurchargeController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Anyone logged in can view surcharges (useful for the quote screen)
router.get('/', getAllSurcharges);

// Only Super Admin can create, edit, or delete
router.post('/', protect, restrictTo('SUPER_ADMIN'), createSurcharge);
router.patch('/:id', protect, restrictTo('SUPER_ADMIN'), updateSurcharge);
router.delete('/:id', protect, restrictTo('SUPER_ADMIN'), deleteSurcharge);

export default router;
