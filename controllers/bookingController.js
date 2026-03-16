import { Booking, Payment, Vehicle } from '../models/index.js';

// User creates a booking (Pending Payment)
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, amount, ...bookingData } = req.body;
    
    // Create the booking
    const booking = await Booking.create({
      ...bookingData,
      vehicleId,
      userId: req.user.id,
      status: 'PENDING_PAYMENT'
    });

    // Create the associated Payment record
    await Payment.create({
      bookingId: booking.id,
      amount: amount,
      depositAmount: amount * 0.5, // Example: 50% deposit
      balanceDue: amount * 0.5,
      status: 'PENDING_VERIFICATION'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin Approves Transfer
export const approveBookingPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByPk(id);
    const payment = await Payment.findOne({ where: { bookingId: id } });

    if (!booking || !payment) return res.status(404).json({ message: 'Not found' });

    // Update both records
    await booking.update({ status: 'CONFIRMED', confirmedAt: new Date() });
    await payment.update({ status: 'SUCCESSFUL' });

    res.json({ success: true, message: 'Payment verified and booking confirmed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};