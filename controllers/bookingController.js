import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Task: Quote Calculation Logic
export const getQuote = async (req, res) => {
  const { zoneId, vehicleType } = req.body;
  try {
    const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!zone) return res.status(404).json({ error: "Zone not found" });

    // Multiplier: SUV = 1.5x, Sedan = 1.0x
    const multiplier = vehicleType === 'SUV' ? 1.5 : 1.0;
    const estimate = zone.basePrice * multiplier;

    res.json({ success: true, estimate, currency: "NGN" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Task: Guest Booking Creation
export const createBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: "Booking failed. Check your data fields." });
  }
};