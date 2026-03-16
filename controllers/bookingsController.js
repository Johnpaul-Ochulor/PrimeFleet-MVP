import { prisma } from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const {
      passengerName,
      passengerPhone,
      passengerEmail,
      numberOfPassengers,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      vehicleId,
      zoneId
    } = req.body;

    const booking = await prisma.booking.create({
      data: {
        passengerName,
        passengerPhone,
        passengerEmail,
        numberOfPassengers,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pickupLocation,
        dropoffLocation,
        vehicleId,
        zoneId
      }
    });

    res.status(201).json({
      message: "Booking created",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuote = async (req, res) => {

  try {

    const { vehicleId, startDate, endDate } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const days =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const amount = days * vehicle.pricePerDay;

    res.json({
      days,
      pricePerDay: vehicle.pricePerDay,
      totalAmount: amount
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export const updateBookingStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({
      message: "Booking status updated",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};