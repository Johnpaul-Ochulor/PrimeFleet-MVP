import express from 'express';
import { uploadPaymentProof, getPendingPayments, verifyPayment } from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// User uploads proof
router.post('/upload-proof', protect, upload.single('proofImage'), uploadPaymentProof);

// Admin views pending payments
router.get('/pending', protect, restrictTo('SUPER_ADMIN'), getPendingPayments);

// Admin verifies a specific payment by ID
router.patch('/verify/:id', protect, restrictTo('SUPER_ADMIN'), verifyPayment);

export default router;