

// import Zone from '../models/Zone.js';
// import ZoneRate from '../models/ZoneRate.js';
// import { Vehicle } from '../models/index.js'; // Import Vehicle to check fleet pricing

// export const getQuote = async (req, res) => {
//   try {
//     const { pickupLocation, dropoffLocation, vehicleType } = req.body;

//     // 1. Find the Zones and the representative Vehicle simultaneously
//     const [fromZone, toZone, fleetSample] = await Promise.all([
//       Zone.findOne({ where: { name: pickupLocation.trim() } }),
//       Zone.findOne({ where: { name: dropoffLocation.trim() } }),
//       Vehicle.findOne({ 
//         where: { vehicleType: vehicleType.toUpperCase(), status: 'active' },
//         attributes: ['pricePerDay'] 
//       })
//     ]);

//     if (!fromZone || !toZone) {
//       return res.status(404).json({ message: 'Locations not found in our service area.' });
//     }

//     // 2. Find the Base Route Rate
//     const rate = await ZoneRate.findOne({
//       where: {
//         fromZoneId: fromZone.id,
//         toZoneId: toZone.id,
//         vehicleType: vehicleType.toUpperCase()
//       }
//     });

//     if (!rate) {
//       return res.status(404).json({ message: 'No pricing available for this route.' });
//     }

    

//     // 3. Calculation: Base Zone Price + Vehicle Premium
//     // If no vehicle exists yet, default premium to 0
//     const basePrice = parseFloat(rate.basePrice);
//     const vehiclePremium = fleetSample ? parseFloat(fleetSample.pricePerDay) : 0;
//     const finalEstimate = basePrice + vehiclePremium;

//     return res.status(200).json({
//       success: true,
//       data: {
//         pickup: fromZone.name,
//         dropoff: toZone.name,
//         vehicle: vehicleType,
//         estimate: finalEstimate,
//         breakdown: {
//           baseFare: basePrice,
//           fleetPremium: vehiclePremium
//         },
//         currency: 'NGN'
//       }
//     });

//   } catch (error) {
//     console.error('Quote Error:', error);
//     res.status(500).json({ message: 'Error calculating quote', error: error.message });
//   }
// };
import Zone from '../models/Zone.js';
import ZoneRate from '../models/ZoneRate.js';
import { Vehicle } from '../models/index.js';

export const getQuote = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, vehicleType } = req.body;

    // 1. Find the Zones FIRST (This is the most critical part)
    const [fromZone, toZone] = await Promise.all([
      Zone.findOne({ where: { name: pickupLocation.trim() } }),
      Zone.findOne({ where: { name: dropoffLocation.trim() } })
    ]);

    // If locations are missing, give a clear error immediately
    if (!fromZone || !toZone) {
      return res.status(404).json({ 
        success: false,
        message: `Locations not found. Found Pickup: ${!!fromZone}, Found Dropoff: ${!!toZone}` 
      });
    }

    // 2. Find the Base Route Rate from the ZoneRates table
    const rate = await ZoneRate.findOne({
      where: {
        fromZoneId: fromZone.id,
        toZoneId: toZone.id,
        vehicleType: vehicleType.toUpperCase()
      }
    });

    if (!rate) {
      return res.status(404).json({ 
        success: false,
        message: `No base pricing found for ${pickupLocation} to ${dropoffLocation} for a ${vehicleType}.` 
      });
    }

    // 3. Find a representative Vehicle to get the "Fleet Premium"
    // We do this separately so if no car exists, we just charge 0 premium instead of erroring
    const fleetSample = await Vehicle.findOne({ 
      where: { 
        vehicleType: vehicleType.toUpperCase(), 
        status: 'active' 
      },
      attributes: ['pricePerDay'] 
    });

    // 4. Final Calculation
    const basePrice = parseFloat(rate.basePrice);
    const vehiclePremium = fleetSample ? parseFloat(fleetSample.pricePerDay) : 0;
    const finalEstimate = basePrice + vehiclePremium;

    return res.status(200).json({
      success: true,
      data: {
        pickup: fromZone.name,
        dropoff: toZone.name,
        vehicle: vehicleType.toUpperCase(),
        estimate: finalEstimate,
        breakdown: {
          baseFare: basePrice,
          fleetPremium: vehiclePremium,
          note: fleetSample ? "Premium added based on fleet availability" : "Base rate only (No active fleet found)"
        },
        currency: 'NGN'
      }
    });

  } catch (error) {
    console.error('Quote Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};