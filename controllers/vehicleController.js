import { Vehicle } from '../models/index.js'; // Ensure Driver is NOT included here if not needed
import cloudinary from '../config/cloudinary.js';

// 1. Get All Vehicles (Item 3: Cleaned up request/response)
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Single Vehicle (Item 3: Added /:id parameter handled in routes)
export const getVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id); // Removed Driver include to keep it "Clean" per Lead request

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create Vehicle (Item 3: Added year and inspectionRecord)
export const createVehicle = async (req, res) => {
  try {
    let photoUrl = '';
    if (req.file) {
      const fileBase64 = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
      const uploadRes = await cloudinary.uploader.upload(fileUri, { folder: 'primefleet/vehicles' });
      photoUrl = uploadRes.secure_url;
    }

    // Explicitly destructure to ensure year and inspectionRecord are captured
    const { 
      make, model, plateNumber, vehicleType, 
      pricePerDay, year, inspectionRecord 
    } = req.body;

    const vehicle = await Vehicle.create({
      make,
      model,
      plateNumber,
      vehicleType,
      pricePerDay,
      year,           // Lead requested this
      inspectionRecord, // Lead requested this
      photoUrl,
      status: 'active' // Default status
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Mark Vehicle Active/Inactive (Item 3: ENTIRELY NEW ENDPOINT)
export const updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'active' or 'inactive'

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    await vehicle.update({ status });
    res.json({ success: true, message: `Vehicle marked as ${status}`, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Update Vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    await vehicle.update(req.body);
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 6. Delete Vehicle (Item 3: Use DELETE method in routes)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    await vehicle.destroy();
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};