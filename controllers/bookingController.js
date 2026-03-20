import { Booking, Payment, Vehicle, LocationSurcharge, isLateNight } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// User creates a booking (Pending Payment)
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, amount, distance, pickupLocation, ...bookingData } = req.body;

    // 1. Fetch the vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // 2. Recalculate the price server-side
    let expectedAmount = vehicle.basePrice + (distance * vehicle.pricePerKm);

    const location = await LocationSurcharge.findOne({ where: { name: pickupLocation } });
    if (location) {
      expectedAmount += location.surcharge;
    }

    if (isLateNight(new Date())) {
      expectedAmount += 1500;
    }

    // 3. Compare against what the user sent
    if (Math.round(amount) !== Math.round(expectedAmount)) {
      return res.status(400).json({
        success: false,
        message: `Price mismatch. Expected ₦${expectedAmount}, received ₦${amount}.`
      });
    }

    // 4. Create the booking
    const booking = await Booking.create({
      ...bookingData,
      vehicleId,
      pickupLocation,
      reference: "PF-" + uuidv4().slice(0, 8),
      status: 'PENDING_PAYMENT'
    });

    // 5. Create the payment record
    await Payment.create({
      bookingId: booking.id,
      amount: expectedAmount,        // use the server-calculated amount, not the user's
      depositAmount: expectedAmount * 0.5,
      balanceDue: expectedAmount * 0.5,
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




export const generateQuote = async (req, res) => {
  try {
    const { vehicleId, distance, pickupLocation } = req.body;

    const vehicle = await Vehicle.findByPk(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // 1. Base + Distance
    let total = vehicle.basePrice + (distance * vehicle.pricePerKm);

    // 2. Location surcharge
    const location = await LocationSurcharge.findOne({
      where: { name: pickupLocation }
    });

    if (location) {
      total += location.surcharge;
    }

    // 3. Time surcharge

    const lateNight = isLateNight(new Date());

    if (lateNight) { total += 1500; // flat late night fee
    }

    res.json({
      success: true,
      data: {
        basePrice: vehicle.basePrice,
        distanceCost: distance * vehicle.pricePerKm,
        locationSurcharge: location?.surcharge || 0,
        timeSurcharge: lateNight ? 1500 : 0,
        total
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};