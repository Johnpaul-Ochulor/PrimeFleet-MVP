import Payment from '../models/Payment.js';
import cloudinary from '../config/cloudinary.js';

export const uploadPaymentProof = async (req, res) => {
  try {
    const { bookingId, amount, transactionRef } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload proof of payment" });
    }

    // Upload receipt to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'primefleet/payments',
    });

    const payment = await Payment.create({
      bookingId,
      amount,
      transactionRef,
      proofUrl: result.secure_url,
      status: 'pending', // Default status
      userId: req.user.id // From auth middleware
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ where: { status: 'pending' } });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};