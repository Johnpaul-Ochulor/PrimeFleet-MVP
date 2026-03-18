import Payment from '../models/Payment.js';
import cloudinary from '../config/cloudinary.js';

export const uploadPaymentProof = async (req, res) => {
  // 1. Log to see exactly what is arriving in your terminal
  console.log('--- Payment Request Started ---');
  console.log('File:', req.file);
  console.log('Body:', req.body);

  try {
    // 2. Destructure EVERYTHING your model requires
    const { amount, depositAmount, balanceDue, transactionRef, type } = req.body;

    // 3. Safety Check: If Multer didn't catch the file, stop here
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "File not found. Ensure Postman key is 'proofImage' and type is 'File'." 
      });
    }

        // 4. Convert the buffer to a base64 string that Cloudinary understands
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // 5. Upload the base64 string instead of req.file.path
        const result = await cloudinary.uploader.upload(fileBase64, {
        folder: 'primefleet/payments',
        });

    // 6. Create the record using the Cloudinary URL and Model fields
    const payment = await Payment.create({
      amount,
      depositAmount,
      balanceDue,
      transactionRef,
      type: type || 'Bank Transfer',
      proofUrl: result.secure_url, // Link from Cloudinary
      status: 'PENDING_VERIFICATION' // Matches your model default
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Database/Cloudinary Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ 
      where: { status: 'PENDING_VERIFICATION' } 
    });
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params; // The payment ID
    const { status } = req.body; // 'SUCCESS' or 'FAILED'

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // Update the status
    payment.status = status;
    await payment.save();

    res.status(200).json({
      success: true,
      message: `Payment marked as ${status}`,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};