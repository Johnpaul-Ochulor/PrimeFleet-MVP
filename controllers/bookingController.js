import { Booking, Payment, Vehicle } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// User creates a booking (Pending Payment)
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, amount, ...bookingData } = req.body;
    
    // Create the booking
    const booking = await Booking.create({
      ...bookingData,
      vehicleId,
      userId: req.user.id,
      reference: "PF-" + uuidv4().slice(0, 8), 
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

// Get booking details by reference
export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;

    const booking = await Booking.findOne({
      where: { reference },
      include: [
        { model: Vehicle },
        { model: Payment }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.json({ success: true, data: booking });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Admin gets all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Vehicle },
        { model: Payment }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Admin assigns driver to booking
export const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    await booking.update({
      driverId,
      status: "ASSIGNED",
      assignedAt: new Date()
    });

    res.json({
      success: true,
      message: "Driver assigned successfully",
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};