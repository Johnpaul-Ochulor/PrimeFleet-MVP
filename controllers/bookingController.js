import { Booking, Payment, Vehicle, Driver } from '../models/index.js'; 

import ZoneRate from '../models/ZoneRate.js'; 

import Zone from '../models/Zone.js';

import { v4 as uuidv4 } from 'uuid';

// 1. Create Booking (Unlocks Steps 1-6)
// export const createBooking = async (req, res) => {
//   try {
//     const { vehicleId, totalAmount, ...bookingData } = req.body;
    
//     const booking = await Booking.create({
//       ...bookingData,
//       vehicleId,
//       totalAmount,
//       userId: req.user ? req.user.id : null, // Handle guest or logged-in
//       reference: "PF-" + uuidv4().split('-')[0].toUpperCase(),
//       status: 'PENDING_PAYMENT'
//     });

//     // Associated Payment Record
//     await Payment.create({
//       bookingId: booking.id,
//       amount: totalAmount,
//       status: 'pending' // Matches Lead's prescribed schema
//     });

//     res.status(201).json({ success: true, data: booking });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// MAIN MAIN
// export const createBooking = async (req, res) => {
//   try {
//     const { customerName, customerPhone, pickupLocation, dropoffLocation, vehicleType, scheduledTime } = req.body;

//     // Generate the Guest Reference (e.g., PF-XJ921)
//     const reference = `PF-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;

//     const booking = await Booking.create({
//       reference,
//       customerName,
//       customerPhone,
//       pickupLocation,
//       dropoffLocation,
//       vehicleType,
//       scheduledTime,
//       status: 'PENDING'
//     });

//     res.status(201).json({ success: true, data: booking });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };


// export const createBooking = async (req, res) => {
//   try {
//     const { 
//       passengerName, 
//       passengerPhone, 
//       passengerEmail, 
//       pickupLocation, 
//       dropoffLocation, 
//       vehicleType,
//       startDate,
//       endDate 
//     } = req.body;

//     // 1. AUTOMATIC PRICE LOOKUP
//     // Search the big table for the exact route and vehicle
//     const rateEntry = await ZoneRate.findOne({
//       where: {
//         pickupLocation: pickupLocation,
//         dropoffLocation: dropoffLocation,
//         vehicleType: vehicleType
//       }
//     });

//     if (!rateEntry) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "We don't service this specific route yet." 
//       });
//     }

//     // 2. GENERATE BOOKING REFERENCE
//     const reference = `PF-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;

//     // 3. SAVE TO DATABASE
//     const newBooking = await Booking.create({
//       reference,
//       passengerName,
//       passengerPhone,
//       passengerEmail,
//       pickupLocation,
//       dropoffLocation,
//       vehicleType,
//       startDate,
//       endDate,
//       totalAmount: rateEntry.amount, // This pulls the 30,600 automatically!
//       status: 'PENDING'
//     });

//     res.status(201).json({ success: true, data: newBooking });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const createBooking = async (req, res) => {
//   try {
//     const { 
//       passengerName, 
//       passengerPhone, 
//       passengerEmail, 
//       pickupLocation, 
//       dropoffLocation, 
//       vehicleType, // Used to find the rate
//       startDate,
//       endDate,
//       numberOfPassengers,
//       instructions 
//     } = req.body;

//     // 1. Automatic Price Lookup from your 6,888-row table
//     const rateEntry = await ZoneRate.findOne({
//       where: {
//         pickupLocation: pickupLocation,
//         dropoffLocation: dropoffLocation,
//         vehicleType: vehicleType
//       }
//     });

//     if (!rateEntry) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "One or both locations not found in our service area." 
//       });
//     }

//     // 2. Generate the unique Reference (e.g., PF-XJ921)
//     const reference = `PF-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;

//     // 3. Create the Booking using your Model's fields
//     const newBooking = await Booking.create({
//       reference,
//       passengerName,
//       passengerPhone,
//       passengerEmail,
//       pickupLocation,
//       dropoffLocation,
//       startDate,
//       endDate,
//       numberOfPassengers: numberOfPassengers || 1,
//       instructions,
//       totalAmount: rateEntry.amount, // Automatically pulled from the DB!
//       status: "PENDING_PAYMENT" // Matching your Model's default
//     });

//     res.status(201).json({
//       success: true,
//       data: newBooking
//     });

//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// export const createBooking = async (req, res) => {
//   try {
//     const { 
//       passengerName, passengerPhone, passengerEmail, 
//       pickupLocation, dropoffLocation, vehicleType,
//       startDate, endDate 
//     } = req.body;

//     // 1. Find the IDs for the names "Lekki Phase 1" and "Ikeja"
//     const [fromZone, toZone] = await Promise.all([
//       Zone.findOne({ where: { name: pickupLocation } }),
//       Zone.findOne({ where: { name: dropoffLocation } })
//     ]);

//     if (!fromZone || !toZone) {
//       return res.status(404).json({ message: "One or both locations not found." });
//     }

//     // 2. Now search the ZoneRate table using the IDs
//     const rateEntry = await ZoneRate.findOne({
//       where: {
//         fromZoneId: fromZone.id, // Use the ID we just found
//         toZoneId: toZone.id,     // Use the ID we just found
//         vehicleType: vehicleType
//       }
//     });

//     if (!rateEntry) {
//       return res.status(404).json({ message: "No rate found for this route/vehicle." });
//     }

//     // 3. Create the Booking with the basePrice from the rate table
//     const reference = `PF-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;
    
//     const newBooking = await Booking.create({
//       reference,
//       passengerName,
//       passengerPhone,
//       passengerEmail,
//       pickupLocation,
//       dropoffLocation,
//       startDate,
//       endDate,
//       totalAmount: rateEntry.basePrice, // Use basePrice because that's what your model calls it!
//       status: "PENDING_PAYMENT"
//     });

//     res.status(201).json({ success: true, data: newBooking });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const createBooking = async (req, res) => {
//   try {
//     // 1. EXTRACT ALL FIELDS FROM REQUEST BODY
//     const { 
//       passengerName, 
//       passengerPhone, 
//       passengerEmail, 
//       pickupLocation, 
//       dropoffLocation, 
//       vehicleType,
//       startDate,
//       endDate,
//       numberOfPassengers, // <--- Now being extracted correctly
//       instructions        // <--- Now being extracted correctly
//     } = req.body;

//     // 2. FIND ZONE IDs BASED ON NAMES (e.g., "Lekki Phase 1")
//     const [fromZone, toZone] = await Promise.all([
//       Zone.findOne({ where: { name: pickupLocation } }),
//       Zone.findOne({ where: { name: dropoffLocation } })
//     ]);

//     if (!fromZone || !toZone) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "One or both locations not found in our service zones." 
//       });
//     }

//     // 3. LOOKUP THE RATE IN YOUR 6,888-ROW TABLE
//     const rateEntry = await ZoneRate.findOne({
//       where: {
//         fromZoneId: fromZone.id,
//         toZoneId: toZone.id,
//         vehicleType: vehicleType.toUpperCase() // Ensures 'sedan' becomes 'SEDAN'
//       }
//     });

//     if (!rateEntry) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "No rate found for this specific route and vehicle type." 
//       });
//     }

//     // 4. GENERATE A UNIQUE REFERENCE
//     const reference = `PF-${Math.random().toString(36).toUpperCase().substring(2, 7)}`;

//     // 5. CREATE THE BOOKING IN THE DATABASE
//     const newBooking = await Booking.create({
//       reference,
//       passengerName,
//       passengerPhone,
//       passengerEmail,
//       pickupLocation,
//       dropoffLocation,
//       startDate,
//       endDate,
//       numberOfPassengers: numberOfPassengers || 1, // Uses your input or defaults to 1
//       instructions: instructions || null,           // Uses your input or remains null
//       totalAmount: rateEntry.basePrice,             // Pulled from the ZoneRate table
//       status: "PENDING_PAYMENT"
//     });

//     // 6. SEND SUCCESS RESPONSE
//     res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: newBooking
//     });

//   } catch (error) {
//     console.error("CRITICAL BOOKING ERROR:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Internal server error: " + error.message 
//     });
//   }
// };

export const createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, vehicleType, scheduledDate } = req.body;
    const userId = req.user.id; // Assuming you have Auth Middleware providing this

    // 1. Validate Zones and Vehicle Availability
    const [fromZone, toZone, assignedVehicle] = await Promise.all([
      Zone.findOne({ where: { name: pickupLocation.trim() } }),
      Zone.findOne({ where: { name: dropoffLocation.trim() } }),
      Vehicle.findOne({ where: { vehicleType: vehicleType.toUpperCase(), status: 'active' } })
    ]);

    if (!fromZone || !toZone) {
      return res.status(404).json({ success: false, message: 'Invalid locations.' });
    }

    if (!assignedVehicle) {
      return res.status(404).json({ success: false, message: `No active ${vehicleType} available.` });
    }

    // 2. Fetch the Base Rate for the price calculation
    const rate = await ZoneRate.findOne({
      where: {
        fromZoneId: fromZone.id,
        toZoneId: toZone.id,
        vehicleType: vehicleType.toUpperCase()
      }
    });

    if (!rate) {
      return res.status(404).json({ success: false, message: 'Pricing not found for this route.' });
    }

    // 3. Final Price Calculation (Base + Vehicle Premium)
    const totalPrice = parseFloat(rate.basePrice) + parseFloat(assignedVehicle.pricePerDay);

    // 4. Create the Booking Record
    const newBooking = await Booking.create({
      userId,
      vehicleId: assignedVehicle.id,
      driverId: assignedVehicle.driverId, // Link the driver assigned to that car
      pickupLocation: fromZone.name,
      dropoffLocation: toZone.name,
      vehicleType: vehicleType.toUpperCase(),
      totalAmount: totalPrice,
      status: 'PENDING',
      scheduledDate,
      reference: `PF-${Math.floor(100000 + Math.random() * 900000)}` // Unique Booking Ref
    });

    return res.status(201).json({
      success: true,
      message: "Booking successful! Awaiting payment.",
      data: newBooking
    });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

// 2. Update Booking Status (General Status Handler - Item 1)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting: 'CONFIRMED', 'COMPLETED', etc.

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const updateData = { status };
    if (status === 'CONFIRMED') updateData.confirmedAt = new Date();
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    await booking.update(updateData);
    
    // If Admin confirms booking, also confirm the payment record
    if (status === 'CONFIRMED') {
        await Payment.update({ status: 'confirmed' }, { where: { bookingId: id } });
    }

    res.json({ success: true, message: `Booking status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Assign Driver (Item 1)
export const assignDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    const booking = await Booking.findByPk(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.update({
      driverId,
      status: "ASSIGNED",
      assignedAt: new Date()
    });

    res.json({ success: true, message: "Driver assigned successfully", data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Cancel Booking (Item 1)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.update({ status: 'CANCELLED', cancelledAt: new Date() });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get All Bookings (Admin - Item 1)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Vehicle }, 
        { model: Payment },
        { model: Driver, as: 'assignedDriver' } // Useful for the Admin table
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get Single Booking by Reference (Customer - Item 1)
export const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    const booking = await Booking.findOne({
      where: { reference },
      include: [{ model: Vehicle }, { model: Payment }]
    });

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};