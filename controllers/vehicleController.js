import { Vehicle } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    let photoUrl = '';
    if (req.file) {
      const fileBase64 = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
      const uploadRes = await cloudinary.uploader.upload(fileUri, { folder: 'primefleet/vehicles' });
      photoUrl = uploadRes.secure_url;
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      photoUrl
    });

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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