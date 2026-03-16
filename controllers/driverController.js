import { Driver } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';

export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { name, phone, licenseNumber } = req.body;
    let photoUrl = '';
    let licenseUrl = '';

    // Handling files from Multer (upload.fields)
    if (req.files?.photo) {
      const res = await cloudinary.uploader.upload(req.files.photo[0].path, { folder: 'primefleet/drivers' });
      photoUrl = res.secure_url;
    }

    if (req.files?.licenseDocument) {
      const res = await cloudinary.uploader.upload(req.files.licenseDocument[0].path, { folder: 'primefleet/licenses' });
      licenseUrl = res.secure_url;
    }

    const driver = await Driver.create({
      name,
      phone,
      licenseNumber,
      photoUrl,
      licensePhotoUrl: licenseUrl
    });

    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};